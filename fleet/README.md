Example showing use of fleet to deploy apps on multiple drones.
Based on http://blog.nodejs.org/2012/05/02/multi-server-continuous-deployment-with-fleet/

To Get this running, open 5 terminal windows:
First run the following to install fleet
npm install -g fleet 

Terminal window #1
cd [fleetDir]
Start the hub using the following command:
bash startHub.sh

Terminal window #2
cd [fleetDir]/drone1
Start a drone using the following command:
bash startDrone.sh

Terminal window #3
cd [fleetDir]/drone2
Start another drone using the following command:
bash startDrone.sh

Add fleet defaults to save typing:
fleet remote add default --hub=127.0.0.1:7000 --secret=beepboop

Terminal window #4
Deploy an API app to the fleet:
cd [fleetDir]/drone_api
Deploy using the following command:
bash fleetDeploy.sh
Then spawn the app using
bash fleetSpawn.sh

You should see output on one of the drones that the API is listening on port 3002
You can test by opening http://localhost:3002/api in a browser

Terminal window #5
Deploy a wepapp to the fleet:
cd [fleetDir]/drone_webapp
Deploy using the following command:
bash fleetDeploy.sh
Then spawn the app using
bash fleetSpawn.sh

You should see output in one of the drones that the webapp is listening on port 3000
You can test by opening http://localhost:3000 in a browser

NOTE spawning more than once will give errors on the drones due to port being in use.
You can view and stop services on the drones by using
fleet ps
then 
fleet stop pid#34cb2

where pid#34cb2 is the pid listed by fleet ps
