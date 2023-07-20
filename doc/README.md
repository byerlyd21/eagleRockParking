# Eagle Rock Parking Summer Project
This repo stores the code and timeline for my Eagle Rock parking project, my thoughts as well as the overall summary.


# Summary
Eagle Rock Properties is in need of a way to organize some information relating to parking, vehicles, as well as storage units. 
They do not have a software that makes this information easily accessable, especially the garage units. If an employee wants to 
know which resident a garage is being rented by, the information is hard to access. If they want to know which car is whos, they 
will have to check their current software tennant by tennant to find the person. The goal of this program is to make the 
search for this information much easier. This will also be a place that employees are able to add new residents, and delete old
residents. It will store car make, model, year, licesnse plate number, licesence plate state, parking sticker code, and garage number
or premiere parking space if applicable. 


# Process
There is a large issue with this programs usefullness to the company, because they currently use a different program to store information.
If the other software is updated, my program is not. This means that every time a resident moves in, or out their data will change. This
deducts from my datas accuracy. If someone searchs up a resident and they do not come up because my website has not been updated, the
program is esentially useless. I will also not be working here forever, so I will not be able to update the information. Updating/adding
new residents to the database will be user firendly, but it will be annoying if it needs to be done every time there are changes to the
other software. If someting is being done already, why do it again? I had wanted to use its API to fetch the data, but my company does not
use the softwares online version. They have paid for the desktop version that does not have API access. Instead I plan to have an option,
where users can upload a csv file of information from the renting software that contains all of the parking information needed. The user
will still need to update the garage info manually, but this won't be a very big issue because there are only 10 garages as opposed to over 500 parking spaces. This will make the program easy to use long after I leave. 


# Guest Parking
The guest parking section allows the user to reserve a guest space for over-night stay. In this section there wil be 25 cells representing
the number of guest parking spaces at the property. These are created with a variable, so If this program is used by a diferent property, 
they will just need to update this so it is catered to their location. The cells will be labeled by either "Avaliable" or an apartment number. If the cell contains an apartment, this means that a resident from that apartment has reserved the guest space. If the cell is clicked, details will appear in a pop-up showing what car is parked there, as well as the guests name, residents name, and the guests contact information. If the space is avaliabe, a form will appear for the resident to fill out. When the form is submitted, the cell will change from avaliable to ocupied.