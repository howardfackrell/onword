var WORD_COUNT = 5;



$(function() {	
	fetchRandomWords();

	$(".word").on('click', function(event) {
		$(".word").removeClass('selected');
		$(this).addClass('selected');
	});

	$(".definition").on('click', function(event) {		
		var defIndex=$(this).closest(".row").data("idx");
		var wordIndex=$('.selected').closest('.row').data('idx');
		swapDefinitions(defIndex, wordIndex);
	});

	$("#score-button").on('click', function(event) {
		clearIncorrect();
		var total = 0;
		var correct = 0;
		for (var i = 0; i < WORD_COUNT; i++) {
			var word = $('#row-'+i+' .word').text()
			var defWord = $('#row-'+i+' .definition').attr('data-word');
			total++;
			console.log(word + "----" + defWord);
			if (word === defWord) {
				correct++;
			} else {
				markIncorrect(i);
			}
		}

		var resultArea = $("#score-result");
		resultArea.empty();
		resultArea.append($("<p>You got " +correct + " out of " + total + "</p>"));
		resultArea.append($("<a href='.'>Play Again?</a>"));

	});
})

var clearIncorrect = function() {
	$('.definition').removeClass('incorrect');
}

var markIncorrect = function(i) {
	$('#row-'+i).find('.definition').addClass('incorrect');
}

var swapDefinitions = function(indexA, indexB) {
	var a = $("#row-"+indexA).find('.definition');
	var b = $("#row-"+indexB).find('.definition');

	var tempDef = a.text();
	var tempWord = a.attr('data-word');

	a.text(b.text());
	a.attr('data-word', b.attr('data-word'));

	b.text(tempDef);
	b.attr('data-word', tempWord);
}



var fetchRandomWords = function() {
	//http://api.wordnik.com:80/v4/words.json/randomWords?hasDictionaryDef=true&includePartOfSpeech=noun&minCorpusCount=0&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&limit=10&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5
		var result = $.ajax({
		url: "http://api.wordnik.com:80/v4/words.json/randomWords",
		data: {
			hasDictionaryDef : true,
			minCorpusCount : 0,
			maxCorpusCount : -1,
			minDictionaryCount : 1,
			maxDictionaryCount : -1,
			includePartOfSpeech : 'noun,verb',
			excludePartOfSpeech : 'noun-plural',
			minLength : 5,
			maxLength :-1,
			limit :WORD_COUNT,
			api_key :'a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5'

		},
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(results){	
		var order = randomOrder();	
		$.each(results, function(i, wordContainer){
			var rIndex = order[i];
			$('#row-'+i+' .word').text(wordContainer.word);
			fetchDefinition(wordContainer.word, rIndex);
		});
	})
	.fail(function(jqXHR, error, errorThrown){
		$('.words').append(error);
	});
}

var fetchDefinition = function(word, i) {
	//http://api.wordnik.com:80/v4/word.json/calcines/definitions?limit=200&includeRelated=true&useCanonical=false&includeTags=false&api_key=a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5

	var result = $.ajax({
		url: "http://api.wordnik.com:80/v4/word.json/" + word + "/definitions",
		data: {
			limit : 1, 
			includeRelated : true,
			useCanonical : false,
			includeTags :false,
			api_key :'a2a73e7b926c924fad7001ca3111acd55af2ffabf50eb4ae5'
		},
		dataType: "jsonp",
		type: "GET",
		})
	.done(function(definitionContainerList){		
		var definitionContainer = definitionContainerList[0];
		var definition = definitionContainer.text;
		var partOfSpeech = definitionContainer.partOfSpeech;	
		var definitionDiv = $('#row-'+i+' .definition');
		definitionDiv.text(partOfSpeech + " " + definition);		
		definitionDiv.attr('data-word', word);
	})
	.fail(function(jqXHR, error, errorThrown){
		$('.words').append(error);
	});
}

var randomOrder = function() {
	var rand = [0,1,2,3,4].sort(function() {
      return .5 - Math.random();
    });
    return rand;
}