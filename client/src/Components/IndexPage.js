import React from "react";
import "./BrowserSpecs.css";
import axios from "axios";
import glogo from "../assets/images/glogo.png";



export default class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = 
    {  url: '',
       tableData: [],
       listNum: [],
       listUrl: [],
       listTime:[],
       terms:[],

       

    

    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    axios.get('/api/search/listurl')
    .then((response) =>{
      //const url = response.data
      //console.log(url)
      //Using spread operator
      //console.log(response.data)
      //let json = JSON.stringify(response.data)
      //console.log(json)
      let json = response.data;
      //console.log(JSON.stringify(json[2]))
      //this.setState({tableData: json});
      //console.log(this.state.tableData);

      console.log(json)
      for(let i = 0; i < response.data.length; i++){
      this.setState({tableData: [...this.state.tableData,response.data[i]]})
      this.setState({listNum: [...this.state.listNum, response.data[i].page_id]})
      this.setState({listUrl: [...this.state.listUrl, response.data[i].url]})
      this.setState({listTime: [...this.state.listTime, response.data[i].time_to_index]})
      }
    
    })


    axios.get('/api/search/terms')
    .then((response) =>{
      let termInfo = response.data;
      console.log(response.data)

      for(let i = 0; i < response.data.length; i++){
        this.setState({terms: [...this.state.terms,response.data[i]]})

      }
    })

    
  }
  

  // loadData = () =>{
  //   axios.get('/api/search/listurl')
  //   .then((response) =>{
  //     //const url = response.data
  //     //console.log(url)
  //     //Using spread operator
  //     //console.log(response.data)
  //     //let json = JSON.stringify(response.data)
  //     //console.log(json)
  //     let json = response.data;
  //     //console.log(JSON.stringify(json[2]))
  //     //this.setState({tableData: json});
  //     //console.log(this.state.tableData);

  //     console.log(typeof json)
  //     for(let i = 0; i < response.data.length; i++){
  //     this.setState({tableData: [...this.state.tableData, JSON.stringify(response.data[i])]})
  //     this.setState({listNum: [...this.state.listNum, response.data[i].page_id]})
  //     this.setState({listUrl: [...this.state.listUrl, response.data[i].url]})
  //     this.setState({listTime: [...this.state.listTime, response.data[i].time_to_index]})
  //     }
    
  //   })

  // }

  indexSite = () => {
    axios
      .post("/api/post/crawl", {
        name: this.state.url
      })
      .then(response => console.log(this.state.url))
      .catch(err => console.log("ERROR GIVEN: + " + err));
  };
  
  // parseData = () =>{
  //   axios.get('/api/search/listurl')
  //     .then((response) =>{
        

  //       const url = response.data
  //       this.setState({url})

    
       
     

        
      

  //     })
  //     .catch(err => console.log(err));
  // }





  handleChange(event) {
    
    this.setState({ url: event.target.value });
    console.log(this.state.url);
   
  }
  handleSubmit(event) {
    event.preventDefault();
    alert('A URL was submitted: ' + this.state.url);
    this.indexSite();
    console.log(this.indexSite());
    
  }
  renderIcon(value, id){
    return(
          <img
            className = "icons rounded-circle"
            onClick={this.handleSubmit}
            src = {value}
            alt = {"icon"}
            width = "30"
            height = "30"
          />
                
    );
            
  }
  
 
  //listOfUrl()
  render() {
    
    return (
      <div className="container">
        
          {/* {console.log("Value "+ this.state.listUrl)}
          {console.log("Value "+ this.state.listTime)}
          {console.log("Value "+ this.state.listNum)} */}
          {/* {
          // console.log(this.state.listUrl)}
          console.log(this.state.terms)} */}


          
          
          

        {/* <ul>
          {this.state.tableData.map(item =>
          <li>{item.url}</li>)}
        </ul> */}
        <form onSubmit={this.handleSubmit}
          className={
            this.state.searchPosTop
              ? "search-bar search-top"
              : "search-bar search-middle"
          }
        >
          <div className="icon-outer-box">
            <div className="icon-inner-box">{this.renderIcon(glogo, 13)}</div>
          </div>
          <input
            
            className="search-input"
            placeholder={"Index Website Here.."}
            value={this.state.value}
            onChange={this.handleChange}
            //onClick={this.handleSubmit}
            type="text"
          />

        </form>
        <br></br>
        
        <div>
          <table className="ui celled table">
            <thead>
              <tr>
                  <th>Number of Results</th>
                  <th>User Search</th>
                  <th>Time</th>
              </tr>
            
            </thead>
            <tbody>
              
          {this.state.tableData.map(item =>
          <tr>
            <td data-label="Result">{item.page_id}</td>
            <td data-label="Search">{item.url}</td>
            <td data-label="Time">{item.time_to_index}</td>
          </tr>)}
      
          
            </tbody>
          </table>
        </div>
        <br></br>

        <div>
          <table className="ui celled table">
            <thead>
              <tr>
                  <th>Term</th>
                  <th>Number of Occurances</th>
                  <th>Search Date</th>
                 
              </tr>
            
            </thead>
            <tbody>
              
          {this.state.terms.map(item =>
          <tr>
            <td data-label="Term">{item.terms}</td>
            <td data-label="Freq">{item.count}</td>
            <td data-label="Freq">{item.search_date}</td>
           
          </tr>)}
      
          
            </tbody>
          </table>
        </div>
      
      </div>
    );
  }
}

function tableData(){
 
  return( 

       <tr>
            <td data-label="Name">A</td>
            <td data-label="Age">C</td>
            <td data-label="Job">C</td>
            
          </tr>


   
     
         
   
          
 );
 
}