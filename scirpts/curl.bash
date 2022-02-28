#!/bin/bash

for ((i = 0; i < $1; i++))
do 
    curl -X POST localhost:8000/properties >> ./responses/test$2.txt
    echo "\r\n\r\n" >> ./responses/test$2.txt
done