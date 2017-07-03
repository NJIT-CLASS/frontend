/**
 * Created by Sohail and Immanuel on 6/9/2017.
 */
import React from 'react';

class Badge extends React.Component {
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

                        Badges Here
                    </div>

                </form>
            </div>
        );
    }
}


export default Badge;