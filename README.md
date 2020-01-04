# pick-a-park-api
RESTful API for the Unicam SPM project "Pick-a-Park"

#### Agenda of the sprint
When defining the team velocity for this sprint, we considered that, based on the previous sprint, we should stick around 10 (in the optimistic case); for this sprint, since we saw from last one that we are able to keep the pace, we decided the sum of story points to achieve in this sprint, to be exactly 10.
The following is a log of what we did on each day of this week-long sprint.

* **29/12/19 - Operative plan**
On the first day of the sprint, we planned what to do: manage users in the system and add management services to the dashboard page, also simulate the behaviour of sensors by issuing random plateNumbers.
* **30/12/19 - User management**
The day after we implemented the user structure in the database, considering also the privileges each user may have depending on their role.
* **31/12/19 - Dashboard services and sample dashboard forms**
The draft for each dashboard service is createad and sample forms in dashboard page, for displaying data from these services, are under construction.
* **01/01/20 - Dashboard service data display**
Since the dashboard page is not yet delivered, test and fixes are carried on with the server.
* **02/01/20 - Sensor retrieval and realtime data**
Since the dashboard page is not yet delivered, test and fixes are carried on with the server. Sensor mock class is created.
* **03/01/20 - Wrapping up and testing**
Since the dashboard page is not yet delivered, test and fixes are carried on with the server. Services wrapped up together in order to prepare a demo.
* **04/01/20 - Final fixes and sprint review**
Since the dashboard page is not yet delivered, test and fixes are carried on with the server. On the last day of the sprint we will discuss about what we achieved in this sprint, the obstacles met during the week and how we can improve the process in order to increase the velocity and achieve more story points.

One team member has been unable to continue on with her work. As a result two user stories has not been completed, thus they will go back to the Product Backlog for being finished in the next sprint.

### User Stories
We wrote the user stories in a Google Sheet document [available here](https://docs.google.com/spreadsheets/d/1CT56THMKohscO8FBVuiHBV9Dpm8neEXZE4Pcw-vWUB8/edit?usp=sharing)
The log of the selected user stories for the sprint is available in json format under the directory *issues*.
Each json file contains the events timeline of each user story, up to this day Saturday 4 January 2020.


### Demo
To try the application the commands to run are
```
git clone https://github.com/UNICAM-CS/sprint-w6-auto-moto.git
npm install
npm start
```
Now the interface should be visible in [localhost:3001](http://localhost:3001)
