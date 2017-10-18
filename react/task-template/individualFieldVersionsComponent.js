import React from 'react';
import Rater from 'react-rater';
import MarkupText from '../shared/markupTextView';

class FieldVersionView extends React.Component{
    constructor(props){
        super(props);
    }
    // PROPS:
    //  Versions: [{}]
    //  Field: {}
    //  Strings: ['']
    //  FieldIndex: int
    render(){
        let rubricView = null;
        let instructionsView = null;
        let completeFieldView = null;
        let taskField = this.props.Field;
        let title = taskField.title;
        let fieldTitle = '';
        let justificationInstructions = null;


        if(taskField.show_title){ // fieldTitle is shown next to the field, so only show if instructor sets show_title to true
            if(taskField.assessment_type != null){ //if it's  grade task, simply add 'Grade' to make it prettier
                fieldTitle = title + ' ' + this.props.Strings.Grade;
            }
            else{
                fieldTitle = title;
            }
        }

        if(this.props.Field.rubric !== ''){
            rubricView = (<div>
                <MarkupText classNames="regular-text" content={this.props.Field.rubric } />
            </div>);
        }

        if(this.props.Field.instructions !== ''){
            instructionsView = (<div>
                <MarkupText classNames="regular-text" content={this.props.Field.instructions } />
            </div>);
        }

        if(this.props.Field.justification_instructions !== ''){
            justificationInstructions = (<div>
                <MarkupText classNames="regular-text" content={this.props.Field.justificationInstructions } />
            </div>);
        }

        let versions = this.props.Versions.map(function(versionArray, vIndex){

            let justification = null;
            let contentView = null;
            let fieldVersion = versionArray[this.props.FieldIndex];
            let versionSubheaderText = '';
            if(vIndex === 0){
                versionSubheaderText = this.props.Strings.Original;
            } else {
                versionSubheaderText = `${this.props.Strings.Revision} ${vIndex}`;
            }

            if(taskField.requires_justification){
                if(fieldVersion[1] == ''){
                    justification = (
                        <div>
                            <div className=".template-field-justification-label">{title} {this.props.Strings.Justification}</div>
                            <div key={this.props.FieldIndex + vIndex + 655}></div>
                        </div>
                    );
                }
                else{
                    justification = (
                        <div>
                            <div className=".template-field-justification-label">{title} {this.props.Strings.Justification}</div>
                            <MarkupText classNames="faded-big" content={fieldVersion[1]} />
                        </div>
                    );
                }
            }

            let fieldContentBlock = null;
            switch(taskField.field_type){
            case 'assessment':
            case 'self assessment':
                switch(taskField.assessment_type){
                case 'grade':
                    fieldContentBlock = (<div key={this.props.FieldIndex + vIndex} className="faded-small"> {fieldVersion[0]}
                    </div>);
                    break;
                case 'rating':
                    let val = (fieldVersion[0] == null || fieldVersion[0] == '') ? 0 : fieldVersion[0];
                    fieldContentBlock = (<div key={this.props.FieldIndex + vIndex + 600}><b>{fieldTitle}   </b>
                        <Rater total={taskField.rating_max} rating={val} interactive={false} />
                    </div>);
                    break;
                case 'pass':
                    fieldContentBlock = (<div key={this.props.FieldIndex + vIndex} className="faded-small"> {fieldVersion[0]}</div>);
                    break;
                case 'evaluation':
                    fieldContentBlock = (<div key={this.props.FieldIndex + vIndex} className="faded-big"> {fieldVersion[0]}
                    </div>);
                    break;
                default:
                    fieldContentBlock = (<div></div>);
                    break;
                }
                break;
            case 'text':
                fieldContentBlock = (
                    <MarkupText classNames="faded-big" content={fieldVersion[0]} />
                );
                break;
            case 'numeric':
                fieldContentBlock = (<div key={this.props.FieldIndex + vIndex} className="faded-small"> {fieldVersion[0]}
                </div>);
                break;
            default:
                fieldContentBlock = (<div></div>);
                break;

            }

            return <div className="version-block">
                <label style={{fontSize: '12px', color: '#777777'}}>{versionSubheaderText}</label><br/>

                {fieldContentBlock}
                <br key={this.props.FieldIndex + vIndex+500}/>
                {justification}
            </div>;

        }, this);

        completeFieldView =  (
            <div key={this.props.FieldIndex +200}>
                <br/>
                {versions}
            </div>
        );

        return <div>{completeFieldView}</div>;
    }
}

export default FieldVersionView;
