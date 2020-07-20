import React, { Component } from 'react'; //import the React library and the Component class from the react package
import OrganizationSelector from './organization-selector';
import strings from "./strings"

class AboutContainer extends Component { //create a class for the component
    //it will be called in the main.js file under /react
    constructor(props){ // set up the component's constructor
        super(props);   // this is pretty boilerplate code, kind of like Java's public static void main()
        // or C's int main() or Python's def main()

        this.state = {}; //initial state, only manually assigned here, elsewhere it's this.setState()
    }

    render(){
        


        let studentData = [
            {
                semesterTitle: strings.SubTitle10,
                topPerformers: ["Brandon Caton (2017-2019)", "Jimmy Lu (2016-2019)",
                 "Alan Romano (2016-2018)", "Michael Raman (2017-2019)", "Erick Sanchez Suasnabar (2013-)"],
                contributors: [],
            },
            {
                semesterTitle: strings.SubTitle11,
                topPerformers: ["Zelin Chen (2018-)", "Joseph Chiou (2017-)", "Jinghui Jiang (2017-2018)", "Shyam Mehta (2018-)"],
                contributors: []
            },
            {
                semesterTitle: strings.SubTitle0,
                topPerformers: [],
                contributors: ['Sean Fisher','Joshua Ortega']
            },
            {
                semesterTitle: strings.SubTitle1,
                topPerformers: ['Stephen Morrison','Cesar Salazar'],
                contributors: ['Christian Alexander','Andres Altamirano'], 
            },
            {
                semesterTitle: strings.SubTitle2,
                topPerformers: [],
                contributors: ['Krzysztof Andres','Maia Iyer','Jason Gong']
            },
            {
                semesterTitle: strings.SubTitle3,
                topPerformers: ['Jonathan Vidal'],
                contributors: ['Angelica Llerena']
            },
            {
                semesterTitle: strings.SubTitle4,
                topPerformers: ['Mohit Nakrani','Brice Delli Paoli'],
                contributors: ['Brian Galok','Ashish Mirji']
            },
            {
                semesterTitle: strings.SubTitle5,
                topPerformers: ['Allen Jiang', 'Amadou Barry', 'Roshni Dhanasekar', 'Sean Leary'],
                contributors: ['Sohail Mansuri',  'Anuradha Naik']
            },
            {
                semesterTitle: strings.SubTitle8,
                topPerformers: [],
                contributors: ['Jonpierre Grajales (evaluator)']
            },
            {
                semesterTitle: strings.SubTitle9,
                topPerformers: ['Jerrod Ransom', 'Mateusz Stolarz','Shantanu Sharma', 'Aravind Narayan'],
                contributors: ['Vaishnavi Reddy Adapala', 'Arun Somasundaram']
            },        
        ];

        return (
            <div className="about">
                <div className="pl-description">
                    <div className="section">
                        <h2 className="title">{strings.TitleString}</h2>
                        <div className="section-content">
                            <p>{strings.Sentence0}</p>
                            <br />
                            <p>{strings.Sentence1}</p>

                            <ul>
                                <li><span ><i className="fa fa-check icon"></i></span>{strings.Step0}</li>
                                <li><span ><i className="fa fa-check icon"></i></span>{strings.Step1}</li>
                                <li><span ><i className="fa fa-check icon"></i></span>{strings.Step2}</li>
                                <li><span ><i className="fa fa-check icon"></i></span>{strings.Step3}</li>
                                <li><span ><i className="fa fa-check icon"></i></span>{strings.Step4}</li>
                                <li><span ><i className="fa fa-check icon"></i></span>{strings.Step5}</li>
                                <li><span ><i className="fa fa-check icon"></i></span>{strings.Step6}</li>
                                <li><span ><i className="fa fa-check icon"></i></span>{strings.Step7}</li>
                            </ul>
                            <img src={'../../static/images/process-figure.png'} style={{width: '100%'}} />
                        </div>
                    </div>
                </div>
                <div className="developers-section">
                    <div className="section" style={{minWidth: "95%"}}>
                        <h2 className="title">{strings.SectionTitle0}</h2>
                    </div>
                    {
                        studentData.map( semesterData => {
                            const topPerformerList = semesterData.topPerformers.map(
                                student => <li key={student}><b 
                                    style={{fontWeight: '600'}}
                                    >
                                        {student}
                                    </b></li>
                            );

                            const contributorList = semesterData.contributors.map(
                                student => <li key={student}>{student}</li>
                            );
                            return <div className="section" key={semesterData.semesterTitle}>
                                <h2 className="title" style={{width: '75%'}}>{semesterData.semesterTitle}</h2>
                                <div className="section-content" >
                                    <ul>
                                        {topPerformerList}
                                        {contributorList}
                                    </ul>
                                </div>
                            </div>;
                        })
                    }
                </div>

                <div className="contact-section">
                    <div className="section" style={{minWidth: "95%"}}>
                        <h2 className="title">{strings.SectionTitle1}</h2>
                    </div>
                    
                    {/* <div className="section">
                        <h2 className="title" style={{width: '80%'}}>{strings.SubTitle6}</h2>
                        <div className="section-content">

                            <OrganizationSelector
                				key={1}
                			/>

                        </div>
                    </div> */}

                    <div className="section">
                        <h2 className="title" style={{width: '80%'}}>{strings.SubTitle7}</h2>
                        <div className="section-content">
                            <ul>
                                <li>Michael Bieber</li>
                                <li style={{textAlign: 'left'}}>New Jersey Institute of Technology</li>
                                <li><a href="mailto:bieber@njit.edu">bieber@njit.edu</a></li>
                                <li style={{textAlign: 'left'}}><a href="http://web.njit.edu/~bieber/pubs.html#p" target="_blank">http://web.njit.edu/~bieber/pubs.html#p</a></li>
                            </ul>
                        </div>
                    </div>

                </div>
            </div>

        );
    }
}

export default AboutContainer;
