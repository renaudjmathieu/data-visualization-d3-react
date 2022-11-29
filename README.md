#  Data Visualization with D3 and React

A simple web app for Data Vizualization built with D3, React, Webpack and Azure Static Web Apps

## :technologist: Available Script Commands

In the project directory, you can run:

### `npm install`

Install the necessary packages by following these steps:

In the Terminal, go to the project folder:
```	
cd data-visualization-d3-react
```	
Option 1 : Install the necessary packages using `package-json`:
```	
npm install
```	
Option 2 : Install the necessary packages manually:
```
npm init
npm install react react-dom
npm install webpack webpack-cli webpack-dev-server --save-dev
npm install html-webpack-plugin --save-dev
npm install @babel/core babel-loader --save-dev
npm install @babel/preset-env @babel/preset-react --save-dev
npm install style-loader css-loader --save-dev
npm install react-router-dom
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install d3

```	


### `npm run dev`

Runs the app in development mode by following these steps:

In the Terminal, go to the project folder:
```	
cd data-visualization-d3-react
```	
Run the app in the development mode: 
```	
npm run dev
```	
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.\
The page will reload when there are changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `dist` folder.

*See the [Webpack](https://webpack.js.org/guides/getting-started/) and the [Babel](https://babeljs.io/docs/en/) documentations for more information.*

## :teacher: Learn More

This web app was built from scratch, without using <code>create-react-app</code> and by configuring **Webpack** and **Babel** manually. For more info on how to set it up, check out [this article](https://medium.com/age-of-awareness/setup-react-with-webpack-and-babel-5114a14a47e9) from [Prateek Srivastava](https://medium.com/@prateeksrt).

To learn how to make the **line chart in D3**, check out [this video](https://youtu.be/S3LNbBg_B2A) by [Amelia Wattenberger](https://wattenberger.com/).

To learn **Azure Static Web Apps**, check out [Static Web Apps!](https://www.azurestaticwebapps.dev/), the [Azure Static Web Apps learning path](https://learn.microsoft.com/en-us/training/paths/azure-static-web-apps/) and the [Azure Static Web Apps documentation](https://learn.microsoft.com/en-us/azure/static-web-apps/overview).

## :judge: Attributions

This web app was built using these products :

[<img src="https://ms-azuretools.gallerycdn.vsassets.io/extensions/ms-azuretools/vscode-azurestaticwebapps/0.11.3/1665693006913/Microsoft.VisualStudio.Services.Icons.Default" width="50">][azure-static-web-apps]
[<img src="https://raw.githubusercontent.com/webpack/media/master/logo/icon-square-big.png" width="55">][webpack]
[<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1024px-React-icon.svg.png" width="50">][react]
[<img src="https://seeklogo.com/images/M/mui-logo-56F171E991-seeklogo.com.png" width="45">][mui]
[<img src="https://raw.githubusercontent.com/d3/d3-logo/master/d3.png" width="45">][d3]

[azure-static-web-apps]: https://azure.microsoft.com/en-us/products/app-service/static/
[webpack]: https://webpack.js.org
[react]: https://reactjs.org
[mui]: https://mui.com/
[d3]: https://d3js.org/