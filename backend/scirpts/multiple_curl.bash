#!/bin/bash

for ((i = 0; i < $1; i++))
do 
    ./curl.bash $2 $i
done