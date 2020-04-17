import React from 'react';
import './App.css';
import { JsonToTable } from "react-json-to-table";


const path=require('path')
class App extends React.Component{

  constructor(props,context){
     super(props,context);
     this.state = {
       dataSource: [],
       time: null,
       combopull: [],
     };
  }


  getData(){

    var xmlhttp = new XMLHttpRequest();
    var self = this;
    var astring = "";
    var aparse;
    const relist = [];
    const tablist = [];

    // console.log('combo rendered')

    // xmlhttp.open("POST",(path.join(__dirname, 'getdata')), true);
    // xmlhttp.open("POST",(path.join(__dirname, 'getdata')), true);
    xmlhttp.open('post','/getdata',true)
      xmlhttp.onreadystatechange=function(){
        console.log(xmlhttp.readyState)
        console.log(xmlhttp.status)
            if (xmlhttp.readyState===4 && xmlhttp.status===200){
              self.setState({
                combopull: JSON.parse(this.response)
              });
              console.log(self.state.combopull)
    }
            }
      xmlhttp.send("recieved");



  }

  getTime(){

    var xmlhttp = new XMLHttpRequest();
    var self = this;
    var astring = "";
    var aparse;
    const relist = [];
    const tablist = [];

    // console.log('combo rendered')

    xmlhttp.open("POST",(path.join(__dirname, 'gettime')), true);
      xmlhttp.onreadystatechange=function(){
        console.log(xmlhttp.readyState)
        console.log(xmlhttp.status)
            if (xmlhttp.readyState===4 && xmlhttp.status===200){
              self.setState({
                time: (this.response)
              });
              console.log(self.state.time)
    }
            }
      xmlhttp.send("recieved");



  }

  check_value = () => {
    console.log('kookoo')
  }
  componentDidMount () {
    this.getData()
    this.getTime()
  }

  render(){
    return(
      <div>
        <p>
          Costco TP TOOL
        </p>
        <div className="App">
      <JsonToTable json={this.state.combopull} />
    </div>
    <p>Last Updated: { this.state.time }</p>
      </div>
    );
  }

}

export default App;