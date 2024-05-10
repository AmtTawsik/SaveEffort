#!/bin/bash

fromUpperSingular="Lead"
fromUpperPlural="Leads"

fromLowerSingular="lead"
fromLowerPlural="leads"

read -p "Enter the table name singular in lowercase: " toLowerSingular
read -p "Enter the table name plural in lowercase: " toLowerPlural

read -p "Enter the table name singular in captilized: " toUpperSingular
read -p "Enter the table name plural in captilized: " toUpperPlural

cp "pages/${fromLowerPlural}.vue" "pages/${toLowerPlural}.vue"


# replace string from page

sed -i "s/$fromUpperPlural/$toUpperPlural/" "pages/${toLowerPlural}.vue"
sed -i "s/$fromUpperSingular/$toUpperSingular/" "pages/${toLowerPlural}.vue"

sed -i "s/$fromLowerPlural/$toLowerPlural/" "pages/${toLowerPlural}.vue"
sed -i "s/$fromLowerSingular/$toLowerSingular/" "pages/${toLowerPlural}.vue"