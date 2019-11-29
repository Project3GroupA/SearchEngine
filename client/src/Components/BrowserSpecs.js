
import React from 'react';
import './BrowserSpecs.css';
import axios from 'axios';




export default class BrowserSpecs extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            data : null,
        }
    }



    // componentDidMount() {
       
    // }

    indexSite = () => {

        axios.post('/api/post/crawl', {
            name: 'https://github.com/'
        })
        .then(response => console.log(response))
        .catch((err) => console.log(err))
    }

    render(){
        return(
            <div className="tables">
                <div className="row browser-tables text-center" >
                    <div>{this.state.data}</div>
                    <button onClick={()=>this.indexSite()} type="button"><span>call api</span></button>
                </div>
            </div>
        );
    }


}