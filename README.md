# pick-a-park-api
RESTful API for the Unicam SPM project "Pick-a-Park"

#### Agenda of the sprint
Team velocity for the sprint: 10
Story points to acquire: 12
The following is a log of what we did on each day of this week-long sprint.

* **16/02/20 - Operative plan**
On the first day of the sprint, we planned what to do: define service for driver's tracking, as well as services for job resolutions by police officer. Finally create a custom view for the parking company admin's page.
* **17/02/20 - Driver's tracking - initial implementation**
The day after we started implementing the service for tracking, taking into consideration the current position of the driver w.r.t. the position of the assigned parking place.
* **18/02/20 - Driver's tracking - fixes and tests**
The tracking service required extensive testing in order to be finalized and this was the focus of the third day.
* **19/02/20 - Job retrieval for police officers**
Following the tracking we focused on the job retrieval and resolution by the police officers. In this way they can easily be warned and solve parking violations.
* **20/02/20 - Custom Page for parking company admins**
This day we focused on implementing the view for the parking company admins, consisting of updates regarding the parking places, police officers and municipalities.
* **21/02/20 - Wrapping up and testing**
The last but one day, we used the testing suite to check if each service was working correctly and we fixed whenever we got an error.
* **22/02/20 - Final fixes and sprint review**
Fixes continued also for the first part of the last day and before delivering we discussed about the sprint.

### User Stories
We wrote the user stories in a Google Sheet document [available here](https://docs.google.com/spreadsheets/d/1CT56THMKohscO8FBVuiHBV9Dpm8neEXZE4Pcw-vWUB8/edit?usp=sharing)
The log of the selected user stories for the sprint is available in json format under the directory *issues*.
Each json file contains the events timeline of each user story, up to this day Saturday 22 February 2020.


### Demo
To try the application the commands to run are
```
git clone https://github.com/UNICAM-CS/sprint-wp13-auto-moto.git
npm install
npm start
```
Now the interface should be visible in [localhost:3001](http://localhost:3001)

Launching the application with this command uses the PaaS MongoDB Atlas, which has problems if connected from certain networks.

To launch the application in development mode which instead uses a local mongodb:
```
git clone https://github.com/UNICAM-CS/sprint-wp13-auto-moto.git
npm install
npm run dev
```

To check the application:
```
git clone https://github.com/UNICAM-CS/sprint-wp13-auto-moto.git
npm install
npm run test
```