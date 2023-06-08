# Covid-19 Queries
This repository contains queries using Apache Spark and MongoDB frameworks to query large COVID-19 Data files.

## Table of Contents
[Contents](#Contents)

[Installation](#Installation)

## Contents
* mongocovid.mongodb.js -- File containing Mongo queries to the COVID-19 tables. File runs in the MongoDB Playground environment in VS Code
* spark.ipynb -- Python notebook containing connection to Spark cluster and queries similar to the Mongo queries
* state_pops.csv, us-counties.csv, us_state_vaccinations.csv -- Files containing COVID-19 information in various states and counties in the United States. More information on this data can be found at https://github.com/nytimes/covid-19-data

## Installation
To run Spark programs you will need two packages:

* pyspark - can be installed with pip - pip install pyspark
* java - you can use the latest version of java. Needs to be the jdk

Refer to [MongoDB installation guide](https://www.mongodb.com/docs/guides/)
