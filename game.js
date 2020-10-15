function submitAnswers(){
	var total = 7;
    var options = 4;
	var score = 0;
	
	//User Import
	var q1 = document.forms["quizForm"]["q1"].value;
	var q2 = document.forms["quizForm"]["q2"].value;
	var q3 = document.forms["quizForm"]["q3"].value;
	var q4 = document.forms["quizForm"]["q4"].value;
	var q5 = document.forms["quizForm"]["q5"].value;
	var q6 = document.forms["quizForm"]["q6"].value;
	var q7 = document.forms["quizForm"]["q7"].value;
        
//	// Validation
//	for(i = 1; i<=total; i++){
//		if(eval('q' + i) == null || eval('q' + i) == ''){
//			alert('You missed question ' + i);
//			return false;
//	   }	
//	}
	
	// Set Answers
	var answers = ["a", "b", "c", "d"];

//	// Check Answers
    // This wont work- need to do separtely for q1 , 2,3,4,5,6,7
//	for(i = 1; i<=total; i++)
//    {
//        for (var j = 1; j<=total; j++)
//        {
//            if('q1' ==  answers [j-1])
//            {
//                console.log("a")
//            }
//
//            if(eval('q' + i) ==  answers [j])
//            {
//                console.log("b")
//            }
//            if(eval('q' + i) ==  answers [j+1])
//            {
//                console.log("c")
//            }
//            if(eval('q' + i) ==  answers [j+2])
//            {
//                console.log("d")
//            }
//        }
//    }
//}

        for (var j = 1; j<=options; j++)
        {
            if(eval('q1') ==  answers [0])
            {
                console.log("a")
            }

            else if(eval('q1') ==  answers [1])
            {
                console.log("b")
            }
            else if(eval('q1') ==  answers [2])
            {
                console.log("c")
            }
            else if(eval('q1') ==  answers [3])
            {
                console.log("d")
            }
        }
    }
