import React from "react";
import "./BrowserSpecs.css";
import axios from "axios";
import glogo from "../assets/images/glogo.png";

export default class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // componentDidMount() {

  // }

  indexSite = () => {
    axios
      .post("/api/post/crawl", {
        name: this.state.value
      })
      .then(response => console.log(this.state.url))
      .catch(err => console.log("ERROR GIVEN: + " + err));
  };
  handleChange(event) {
    this.setState({ url: event.target.value });
    console.log("ok")
  }
  handleSubmit(event) {
    //alert('A URL was submitted: ' + this.state.value);
    this.indexSite();
    console.log(this.indexSite());
    event.preventDefault();
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
 

  render() {
    return (
      <div>
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
            onKeyDown={this.handleChange}
            //onClick={this.handleSubmit}
            type="text"
          />

        </form>
        <div className="tables">
          <div className="row browser-tables text-center">
            <div>{this.state.data}</div>
            <button onClick={() => this.indexSite()} type="button">
              <span>call api</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
