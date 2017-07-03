/**
 * Created by Sohail and Immaunel on 6/9/2017.
 */
import React from 'react';

class BadgeCategory extends React.Component {
    constructor(props){
        super(props);

        this.state = {};
    }

    render(){
        return (
            <div className="section card-2">
                <h2 className="title">Category</h2>
                <form className="section-content" >

                    <ul>
                        <li>OverAll</li>
                        <li>Question</li>
                        <li>Answer</li>
                        <li>Solution</li>
                        <li>Grades</li>
                        <li>Time Taken</li>
                    </ul>

                </form>
            </div>
        );
    }
}
export default BadgeCategory;