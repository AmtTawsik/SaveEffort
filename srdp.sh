#!/bin/bash
read -p "Enter the table name singular in lowercase: " toLowerSingular
read -p "Enter the table name plural in lowercase: " toLowerPlural

read -p "Enter the table name singular in captilized: " toUpperSingular
read -p "Enter the table name plural in captilized: " toUpperPlural

rm "pages/${toLowerPlural}.vue"
rm "stores/${toLowerSingular}.js"
rm "composables/${toLowerSingular}.js"
rm "components/SideDrawer/${toUpperSingular}.vue"