-- phpMyAdmin SQL Dump
-- version 3.2.0.1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Mar 21, 2015 at 09:51 AM
-- Server version: 5.1.36
-- PHP Version: 5.3.0

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `dbmenu`
--

-- --------------------------------------------------------

--
-- Table structure for table `main_menu`
--

CREATE TABLE IF NOT EXISTS `main_menu` (
  `m_menu_id` int(2) NOT NULL AUTO_INCREMENT,
  `m_menu_name` varchar(20) NOT NULL,
  `m_menu_link` varchar(50) NOT NULL,
  PRIMARY KEY (`m_menu_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `main_menu`
--

INSERT INTO `main_menu` (`m_menu_id`, `m_menu_name`, `m_menu_link`) VALUES
(1, 'web service', 'web-service.php'),
(6, 'about us', 'about-us.html');

-- --------------------------------------------------------

--
-- Table structure for table `sub_menu`
--

CREATE TABLE IF NOT EXISTS `sub_menu` (
  `s_menu_id` int(2) NOT NULL AUTO_INCREMENT,
  `m_menu_id` int(2) NOT NULL,
  `s_menu_name` varchar(20) NOT NULL,
  `s_menu_link` varchar(50) NOT NULL,
  PRIMARY KEY (`s_menu_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=10 ;

--
-- Dumping data for table `sub_menu`
--

INSERT INTO `sub_menu` (`s_menu_id`, `m_menu_id`, `s_menu_name`, `s_menu_link`) VALUES
(1, 1, 'seo', 'seo.html'),
(2, 1, 'hosting', 'web-hosting.html'),
(3, 1, 'Domain Reg', 'd-registration.html'),
(4, 2, 'php', 'php.html'),
(5, 2, 'asp', 'asp.html'),
(6, 5, 'job portal', 'job-portal.html'),
(7, 5, 'cms', 'cms.html'),
(8, 6, 'our team', 'our-team.html'),
(9, 6, 'copyright', 'copyright.html');
