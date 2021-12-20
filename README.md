# Cumulocity Indoor Air Quality Widget

The Indoor Air Quality Widget displays the current value of the measured indoor air quality and the corresponding condition. In addition, it provides a recommendation on how the indoor air quality can be improved in case it is necessary.



### Installation - for the dashboards using Runtime Widget Loader
1. Download the latest `indoor-air-qality-widget-{version}.zip` file from the Releases section.
2. Make sure you have Runtime Widget Loader installed on your Cockpit or App Builder app.
3. Open a dashboard.
4. Click `more...`.
5. Select `Install Widget` and follow the instructions.

### Development - to do the enhancements and testing locally
1. Clone the repository on local machine using `git clone git@github.com:SoftwareAG/cumulocity-indoor-air-quality-widget.git`.
2. Run `npm install` to download the module dependencies.
3. Update start script in the `package.json` and add your Cumulocity tenant URL: `c8ycli server -u https://your_tenant_url` 
4. Run `npm run start` to start the local server.
5. Go to `http://localhost:9000/apps/cockpit/` in the browser to view and test your changes.

### Build - to create a new build for the Runtime Widget Loader
1. Finish the development and testing on your local machine.
2. Run `npm run runtime` to trigger the build process using gulp
3. Once the build has finished, the newly created zip archive is available in `./runtime/dist/indoor-air-qality-widget-{{version}}.zip`

------------------------------
  
This widget is provided as-is and without warranty or support. They do not constitute part of the Software AG product suite. Users are free to use, fork and modify them, subject to the license agreement. While Software AG welcomes contributions, we cannot guarantee to include every contribution in the master project.
_____________________
For more information you can Ask a Question in the [TECHcommunity Forums](http://tech.forums.softwareag.com/techjforum/forums/list.page?product=cumulocity).
  
You can find additional information in the [Software AG TECHcommunity](http://techcommunity.softwareag.com/home/-/product/name/cumulocity).
