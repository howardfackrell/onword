$(function() {	
	fetchRandomWords();

	$(".word").on('click', function(event) {
		$(".word").removeClass('selected');
		$(this).addClass('selected');
	});
})

var WORD_COUNT = 5;

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
			$('#row-'+rIndex+' .word').text(wordContainer.word);
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