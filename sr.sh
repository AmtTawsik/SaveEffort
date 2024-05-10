#!/bin/bash

fromUpperSingular="Contact"
fromUpperPlural="Contacts"

fromLowerSingular="contact"
fromLowerPlural="contacts"

read -p "Enter the table name singular in lowercase: " toLowerSingular
read -p "Enter the table name plural in lowercase: " toLowerPlural

read -p "Enter the table name singular in captilized: " toUpperSingular
read -p "Enter the table name plural in captilized: " toUpperPlural

cp "pages/${fromLowerPlural}.vue" "pages/${toLowerPlural}.vue"
cp "stores/${fromLowerSingular}.js" "stores/${toLowerSingular}.js"
cp "composables/${fromLowerSingular}.js" "composables/${toLowerSingular}.js"

# replace string from page

sed -i "s/$fromUpperPlural/$toUpperPlural/" "pages/${toLowerPlural}.vue"
sed -i "s/$fromLowerPlural/$toLowerPlural/" "pages/${toLowerPlural}.vue"

sed -i "s/$fromUpperSingular/$toUpperSingular/" "pages/${toLowerPlural}.vue"
sed -i "s/$fromLowerSingular/$toLowerSingular/" "pages/${toLowerPlural}.vue"

# replace string from store

sed -i "s/$fromLowerPlural/$toLowerPlural/" "stores/${toLowerSingular}.js"
sed -i "s/$fromUpperPlural/$toUpperPlural/" "stores/${toLowerSingular}.js"

sed -i "s/$fromUpperSingular/$toUpperSingular/" "stores/${toLowerSingular}.js"
sed -i "s/$fromLowerSingular/$toLowerSingular/" "stores/${toLowerSingular}.js"

# replace string from composables

sed -i "s/$fromUpperPlural/$toUpperPlural/" "composables/${toLowerSingular}.js"
sed -i "s/$fromLowerPlural/$toLowerPlural/" "composables/${toLowerSingular}.js"

sed -i "s/$fromUpperSingular/$toUpperSingular/" "composables/${toLowerSingular}.js"
sed -i "s/$fromLowerSingular/$toLowerSingular/" "composables/${toLowerSingular}.js"