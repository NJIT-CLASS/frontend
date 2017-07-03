/**
 * Created by Sohail and Immanuel on 7/2/2017.
 */

import React from 'react';
import ClassForBadge from './classForBadge';
import BadgeCategory from './badgeCategory';
import Badge from './badge';


class MainBadge extends React.Component {
    constructor(props){
        super(props);

        this.state = {};
    }
    render(){
        return (

            <div className="container">

                <div id = "left-half-badge">
                    <div className="col-xs-6">
                        <ClassForBadge />
                    </div>
                </div>

                <div id = "right-half-badge">
                    <div id = "badgeCategory">
                        <BadgeCategory />
                    </div>

                    <div id = "badge">
                        <Badge />
                    </div>
                </div>

            </div>
        );
    }
}


export default MainBadge;