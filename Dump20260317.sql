-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: biasguard
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `action` varchar(150) DEFAULT NULL,
  `resource` varchar(150) DEFAULT NULL,
  `details` json DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_audit_logs_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fairness_history`
--

DROP TABLE IF EXISTS `fairness_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fairness_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `original_fairness` float DEFAULT NULL,
  `mitigated_fairness` float DEFAULT NULL,
  `improvement` float DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ix_fairness_history_id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fairness_history`
--

LOCK TABLES `fairness_history` WRITE;
/*!40000 ALTER TABLE `fairness_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `fairness_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `monitoring_results`
--

DROP TABLE IF EXISTS `monitoring_results`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `monitoring_results` (
  `id` int NOT NULL AUTO_INCREMENT,
  `synthesis_job_id` int DEFAULT NULL,
  `fairness_metrics` json DEFAULT NULL,
  `drift_metrics` json DEFAULT NULL,
  `model_predictions` json DEFAULT NULL,
  `alerts` json DEFAULT NULL,
  `timestamp` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `synthesis_job_id` (`synthesis_job_id`),
  KEY `ix_monitoring_results_id` (`id`),
  CONSTRAINT `monitoring_results_ibfk_1` FOREIGN KEY (`synthesis_job_id`) REFERENCES `synthesis_jobs` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `monitoring_results`
--

LOCK TABLES `monitoring_results` WRITE;
/*!40000 ALTER TABLE `monitoring_results` DISABLE KEYS */;
/*!40000 ALTER TABLE `monitoring_results` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schemas`
--

DROP TABLE IF EXISTS `schemas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schemas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `name` varchar(150) DEFAULT NULL,
  `schema_definition` json DEFAULT NULL,
  `attributes` json DEFAULT NULL,
  `sensitive_fields` json DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `ix_schemas_id` (`id`),
  KEY `ix_schemas_name` (`name`),
  CONSTRAINT `schemas_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schemas`
--

LOCK TABLES `schemas` WRITE;
/*!40000 ALTER TABLE `schemas` DISABLE KEYS */;
/*!40000 ALTER TABLE `schemas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `synthesis_jobs`
--

DROP TABLE IF EXISTS `synthesis_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `synthesis_jobs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `schema_id` int DEFAULT NULL,
  `job_name` varchar(150) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `num_records` int DEFAULT NULL,
  `demographic_config` json DEFAULT NULL,
  `output_path` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `completed_at` datetime DEFAULT NULL,
  `error_message` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `schema_id` (`schema_id`),
  KEY `ix_synthesis_jobs_job_name` (`job_name`),
  KEY `ix_synthesis_jobs_id` (`id`),
  CONSTRAINT `synthesis_jobs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `synthesis_jobs_ibfk_2` FOREIGN KEY (`schema_id`) REFERENCES `schemas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `synthesis_jobs`
--

LOCK TABLES `synthesis_jobs` WRITE;
/*!40000 ALTER TABLE `synthesis_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `synthesis_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `hashed_password` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_users_username` (`username`),
  UNIQUE KEY `ix_users_email` (`email`),
  KEY `ix_users_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'jefrin','jefrin@gmail.com','$pbkdf2-sha256$29000$JCTE2Nub836P8f4/R2itNQ$GX9wRVeePgj4jbRg3xNJgyClE5q7EyMhZ8t9pPTMDp0','user',1,'2026-03-07 16:54:17'),(2,'biasguard','biasguard@gmail.com','$pbkdf2-sha256$29000$pvQ.h3BOiTGG8D7nfE8JgQ$AzbODlcxBGrCYa/VY8zrRpb4ZpwEQru0GFnY0did3sQ','user',1,'2026-03-08 13:23:28'),(3,'jefrin@gmail.com','jefrinraja10th@gmail.com','$pbkdf2-sha256$29000$n/P.3zunVEopZUxJ6Z1T6g$aOIpwycmxStdnSKGRlL9.uQVk3knXxBRAO27NqVmSp8','user',1,'2026-03-16 15:21:02');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-17 13:26:09
