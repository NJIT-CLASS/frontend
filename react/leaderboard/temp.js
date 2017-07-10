/**
 * Created by Sohail and Immanuel on 6/9/2017.
 */
import React from 'react';

/*
 var ProgressBar = require('react-progressbar.js');
 var Circle = ProgressBar.Circle;
 */

class temp extends React.Component {
    constructor(props){
        super(props);

        this.state = {};
    }

    render(){
        return (

            <div className="section card-2">
                <h2 className="title">Badge Earned</h2>
                <form className="section-content" >
                    <div className = "col-xs-6">
                        Badges Here Should be images
                        <img src="/static/images/badgeDummy.png" alt="Badge Dummy 1" className="badgesImages" />
                        <img src="/static/images/badgeDummy2.png" alt="Badge Dummy 2" className="badgesImages" />
                        <img src="/static/images/g.png" alt="Badge Dummy 3" className="badgesImages" />
                        <img src="/static/images/logo_background.png" alt="Badge Dummy 4" className="badgesImages" />
                    </div>

                </form>





            </div>

        );
    }
}


export default temp;