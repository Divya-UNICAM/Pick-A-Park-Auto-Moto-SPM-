# pick-a-park-api
RESTful API for the Unicam SPM project "Pick-a-Park"

#### Agenda of the sprint
When defining the team velocity for this sprint, we considered that, based on the previous sprint, we should stick around 10 (in the optimistic case); for this sprint, since we saw from last one that we are able to keep the pace, we decided the sum of story points to achieve in this sprint, to be exactly 10.
The following is a log of what we did on each day of this week-long sprint.

* **29/12/19 - Operative plan**
On the first day of the sprint, we planned what to do: create a page displaying the route to the destination and build a mock page for the administrators dashboard.
* **30/12/19 - User management**
The day after we implemented a page for adding users and a page for enabling users to enter their management page.
* **31/12/19 - Dashboard services and sample dashboard forms**
The dashboard (management) page for users is released, but functionalities like adding sensors or parking places are still not mocked in the application.
* **01/01/20 - Dashboard service data display**
The client interface now doesn't need anymore to ask the starting location when issuing a request for a parking place, thanks to HTML5 geolocation.
* **02/01/20 - Sensor retrieval and realtime data**
After the user pays for a parking place, directions are created from freely available apis and then the route to the parking place is shown in a map.
* **03/01/20 - Wrapping up and testing**
On last but one day of the sprint we tested each functionality and wrapped up together pages and services in order to prepare a demo.
* **04/01/20 - Final fixes and sprint review**
On the last day of the sprint we will discuss about what we achieved in this sprint, the obstacles met during the week and how we can improve the process in order to increase the velocity and achieve more story points.

After the first day of the sprint, one team member has been unable to continue on with her work. As a result two user stories has not been completed, thus they will go back to the Product Backlog for being finished in the next sprint.

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
