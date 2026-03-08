import numpy as np
import pandas as pd
import torch
import torch.nn as nn
import torch.optim as optim
from sklearn.preprocessing import StandardScaler, LabelEncoder
from torch.utils.data import TensorDataset, DataLoader


class VAEEncoder(nn.Module):
    """Variational Autoencoder Encoder"""
    
    def __init__(self, input_dim, hidden_dim=64, latent_dim=10):
        super(VAEEncoder, self).__init__()
        
        self.fc1 = nn.Linear(input_dim, hidden_dim)
        self.fc_mu = nn.Linear(hidden_dim, latent_dim)
        self.fc_logvar = nn.Linear(hidden_dim, latent_dim)
        
        self.relu = nn.ReLU()
    
    def forward(self, x):
        h = self.relu(self.fc1(x))
        mu = self.fc_mu(h)
        logvar = self.fc_logvar(h)
        return mu, logvar


class VAEDecoder(nn.Module):
    """Variational Autoencoder Decoder"""
    
    def __init__(self, latent_dim, hidden_dim=64, output_dim=None):
        super(VAEDecoder, self).__init__()
        
        if output_dim is None:
            output_dim = 10
        
        self.fc1 = nn.Linear(latent_dim, hidden_dim)
        self.fc2 = nn.Linear(hidden_dim, output_dim)
        
        self.relu = nn.ReLU()
        self.sigmoid = nn.Sigmoid()
    
    def forward(self, z):
        h = self.relu(self.fc1(z))
        x_recon = self.sigmoid(self.fc2(h))
        return x_recon


class VAE(nn.Module):
    """Complete Variational Autoencoder"""
    
    def __init__(self, input_dim, hidden_dim=64, latent_dim=10):
        super(VAE, self).__init__()
        
        self.encoder = VAEEncoder(input_dim, hidden_dim, latent_dim)
        self.decoder = VAEDecoder(latent_dim, hidden_dim, input_dim)
        self.latent_dim = latent_dim
    
    def reparameterize(self, mu, logvar):
        """Reparameterization trick"""
        std = torch.exp(0.5 * logvar)
        eps = torch.randn_like(std)
        z = mu + eps * std
        return z
    
    def forward(self, x):
        mu, logvar = self.encoder(x)
        z = self.reparameterize(mu, logvar)
        x_recon = self.decoder(z)
        return x_recon, mu, logvar
    
    def sample(self, num_samples):
        """Generate new samples from prior"""
        with torch.no_grad():
            z = torch.randn(num_samples, self.latent_dim)
            samples = self.decoder(z)
        return samples.cpu().numpy()


def vae_loss(x_recon, x, mu, logvar):
    """VAE loss: reconstruction + KL divergence"""
    
    # Reconstruction loss
    bce_loss = nn.BCELoss(reduction='sum')
    recon_loss = bce_loss(x_recon, x)
    
    # KL divergence
    kl_loss = -0.5 * torch.sum(1 + logvar - mu.pow(2) - logvar.exp())
    
    return recon_loss + kl_loss


def train_vae(df, latent_dim=10, epochs=50, batch_size=64, device='cpu'):
    """
    Train a VAE on tabular data.
    
    Args:
        df: Input dataframe (numeric only, should be preprocessed)
        latent_dim: Dimension of latent space
        epochs: Number of training epochs
        batch_size: Batch size for training
        device: 'cpu' or 'cuda'
        
    Returns:
        Trained VAE model
    """
    
    # Ensure all data is numeric
    df_numeric = df.select_dtypes(include=[np.number])
    
    if df_numeric.empty:
        raise ValueError("No numeric columns found in dataframe")
    
    # Normalize data to [0, 1]
    scaler = StandardScaler()
    df_scaled = scaler.fit_transform(df_numeric)
    
    # Clip to [0, 1] after scaling
    df_scaled = np.clip(df_scaled, 0, 1)
    
    # Convert to tensor
    X_tensor = torch.FloatTensor(df_scaled).to(device)
    dataset = TensorDataset(X_tensor)
    dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True)
    
    # Create model
    input_dim = df_scaled.shape[1]
    vae = VAE(input_dim, hidden_dim=64, latent_dim=latent_dim).to(device)
    
    # Training
    optimizer = optim.Adam(vae.parameters(), lr=1e-3)
    
    for epoch in range(epochs):
        total_loss = 0
        for batch in dataloader:
            x = batch[0].to(device)
            
            # Forward pass
            x_recon, mu, logvar = vae(x)
            loss = vae_loss(x_recon, x, mu, logvar)
            
            # Backward pass
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
            
            total_loss += loss.item()
    
    return vae, scaler


def generate_synthetic_with_vae(vae, scaler, num_samples, device='cpu'):
    """
    Generate synthetic samples from trained VAE.
    
    Args:
        vae: Trained VAE model
        scaler: Fitted StandardScaler
        num_samples: Number of synthetic samples to generate
        device: 'cpu' or 'cuda'
        
    Returns:
        Synthetic data samples
    """
    
    synthetic_scaled = vae.sample(num_samples)
    
    # Unscale synthetic data
    synthetic_data = scaler.inverse_transform(synthetic_scaled)
    
    return synthetic_data
