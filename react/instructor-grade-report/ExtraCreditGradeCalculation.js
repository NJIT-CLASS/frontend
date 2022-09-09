export function getTaskTimelinessGrade(status, grade, daysLate, penalty){
    if (status === "complete"){
        return grade * (1 - Math.min(daysLate * (penalty/100), 1));
    } else if (status === "not complete" || status === "task bypassed"){
        return "-";
    } else if (status === "task cancelled"){
        return 0;
    }

}

export function getTaskTimelinessGradeScaled(status, grade, maxGrade, daysLate, penalty){
    return getTaskTimelinessGrade(status, grade, daysLate, penalty)/maxGrade * 100;
}

export function getTimelinessGrade(timelinessGradeDetails){
    var timelinessGrade = 0;
    for (var TI_ID in timelinessGradeDetails){
        let TI = timelinessGradeDetails[TI_ID];
        timelinessGrade+=getTaskTimelinessGrade(TI.status, TI.grade, TI.daysLate, TI.penalty);
    }
    if (isNaN(timelinessGrade)) {
        return "-";
    } else {
        return timelinessGrade;
    }
}

export function getConvNumGrade(value, type, max){
    var convNumGrade = null;
    if (type === "Label"){
        convNumGrade = 100;
    } else if (type === "Pass/Fail") {
        convNumGrade = value == "pass" ? 100 : 0;
    } else {
        convNumGrade = (value/max) * 100; 
    }
    return isNaN(convNumGrade) ? "-" : convNumGrade;
}

export function getConvNumGradeScaled (value, type, max, weight){
    return isNaN(getConvNumGrade(value, type, max)) ? "-" : getConvNumGrade(value, type, max) * (weight/100);
}

export function getMax(type, max){
    if (type === "Label") {
        return 100;
    } else if (type === "Pass/Fail") {
        return 1;
    } else {
        return max;
    }
}

export function getECTaskGrade(){
    // for(var taskID in PTTGRGradeData){
    //     let task = PTTGRGradeData[taskID];

        
    //     //generating task grade for non-completely graded tasks
        
    //     if (taskID !== "timelinessGrade" && task.taskGrade === "not yet complete"){
    //         var calculatedTaskGrade = Number.NEGATIVE_INFINITY;
    //         var calculatedTaskGradeString = "";
    //         //iterating over task instances present in taskGradeFields
    //         if (Object.keys(task.taskGradeFields).length === 0) calculatedTaskGrade = "-";
    //         else {
    //             for (var TI in task.taskGradeFields){
    //                 var taskInstance = task.taskGradeFields[TI]; 
    //                 var sumOfScaledGrades = 0;
    //                 var convNumGrade = 0;
    //                 //calculating the sum of the scaled grades from each task instance
    //                 for (var f in taskInstance){
    //                     var field = taskInstance[f];
    //                     if (field.type === "Label")
    //                         convNumGrade = 100;
    //                     else if (field.type === "Pass/Fail")
    //                         convNumGrade = field.value == "pass" ? 100 : 0;
    //                     else 
    //                         convNumGrade = ((field.value/field.max) * 100).toFixed(2); 
    //                     sumOfScaledGrades+=convNumGrade*field.weight;
    //                 }
    //                 //storing the grade of the task instance with the highest grade in calculatedTaskGrade
    //                 if (sumOfScaledGrades > calculatedTaskGrade)
    //                     calculatedTaskGrade = sumOfScaledGrades;
                    
    //             }
    //         }                
            
    //     }
    //     else if (taskID !== "timelinessGrade" && task.taskGrade !== "not yet complete"){
    //         if (!isNaN(task.taskGrade)){
    //             calculatedTaskGrade = task.taskGrade;
    //             //if workflowGrade==null, then include "in progress"
    //             if (workflowGrade === "not yet complete"){
    //                 calculatedTaskGradeString = "(in progress: " + calculatedTaskGrade.toFixed(2) + ")";
    //             }
    //         }
    //         else calculatedTaskGrade = "-";
            
            
    //     }
        
    //     var scaledGrade = (taskID === "timelinessGrade" ? sumTimelinessGrade * task.weightInProblem/100 : 
    //                             (isNaN(calculatedTaskGrade)  ? "-" : calculatedTaskGrade * task.weightInProblem/100))
    //     if (!isNaN(scaledGrade)) scaledGrade = scaledGrade.toFixed(2);
        
}

//applies to both normal and extra-credit task field report tables
export function getTaskFieldReport(TGFRGradeData, numOfTaskGrades){
        var TableTGFRGradeDataFrame = [];
        var TableTGFRGradeData = [];

        var taskNumber = 1;
        for(var key in TGFRGradeData){
            var finalGradeFields = TGFRGradeData[key];

            for(var taskGradeID in finalGradeFields){
                var taskGrade = finalGradeFields[taskGradeID]; 

                var value = null;
                var maxValue = null;
                var convNumGrade = null;

                if (taskGrade.type === "Pass/Fail" || taskGrade.type === "Label" || taskGrade.type === "Rating" || taskGrade.type === "Numeric"){
                    if (taskGrade.type === "Label"){
                        value = taskGrade.value;
                        maxValue = taskGrade.labelMaxValue + " (" + taskGrade.max + ")";  
                        convNumGrade = taskGrade.convertedNumericValue + " (" + taskGrade.labelPosition + ")";

                    } else if (taskGrade.type === "Pass/Fail"){
                        value = taskGrade.value;
                        maxValue = "pass";
                        convNumGrade = taskGrade.convertedNumericValue;
                    } else {
                        value = taskGrade.value;
                        maxValue = taskGrade.max;
                        convNumGrade = taskGrade.convertedNumericValue;
                    }
                    
                
                
                    TableTGFRGradeData.push({
                        Field:taskGrade.name != null ? taskGrade.name: "Unnamed",
                        Type:taskGrade.type,
                        Value: value,
                        ConvertedNumericValue: convNumGrade,
                        Max: maxValue,
                        WeightWTask: taskGrade.weight,
                        ScaledGrade: taskGrade.scaledGrade
                    });
                }
                

            }
            TableTGFRGradeDataFrame.push(TableTGFRGradeData);
            TableTGFRGradeData = [];
        }
        
        return TableTGFRGradeDataFrame;
}