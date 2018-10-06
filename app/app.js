
			// stores the currently selected element for each trait
			var currentTraits = {might: 0, speed: 0, sanity: 0, knowledge: 0};
			
			// list of all available characters and their information
			var characters;

			// the currently selected character
			var curCharacter;

			$(window).load(initContent);

			function initContent()
			{
				$.getJSON('getCharacters.php', function(data)
				{
					characters = data.person;

					var i;
					var currentPerson;
					var len = characters.length;

					var selector= $("#characterSelector");

					selector.append("<option class='specialOp' value='-1'>CHOOSE A CHARACTER</option>");

					for(i = 0; i<len; i++)
					{
						currentPerson = characters[i];

						selector.append("<option class='specialOp' value='" + i + "'>" + currentPerson.name + "</option>");
					}

					// reset select width
					//selector.width($(".selectContainer").width());

					selector.change(function()
						{
							localStorage.removeItem('characterIndex');
							localStorage.removeItem('currentTraitValues');
							loadCharacter();
						});

					// setup animation event triggers for our handles
					$('.handle').each(function(index)
					{
						$(this).bind('webkitTransitionEnd', handleAnimationComplete);
						$(this).bind('transitionend', handleAnimationComplete);
						$(this).bind('oTransitionEnd', handleAnimationComplete);
					});

					// retrieve/reset any previous character information
					// (used when a web app reloads automatically when opening)
					
					if(localStorage.characterIndex)
					{
						selector.val( localStorage.characterIndex ).attr('selected',true);
						loadCharacter();
					}

					// reset center positions for each trait if the window is resized
					// and also re-center all handles
					window.onresize = function(event)
					{
						setupTraitClicks();

						//re-center handles
						centerAllHandles();
					}
				});
			}

			function postCharacterLoadInit()
			{
				
				setupTraitClicks();

				// initialize the default traits as selected
				$('#default.trait').each(function(index)
				{
					var parentID = $(this).parent().attr('id');

					currentTraits[parentID] = this;

					$(this).click();
				});

				centerAllHandles();
			}

			function loadCharacter()
			{
				// clear the defaults from the last character
				$('.trait').each(function(index)
			    { 
			    	$(this).removeAttr("id");
			    });

				var index = $("#characterSelector option:selected").val();

				curCharacter = characters[index];

				// change character image
				var charHead = $("#characterHeadshot");
				charHead.attr("src", curCharacter.image);

				// change character title
				var charName = $("#characterTitle");

				charName.html(curCharacter.name);

				// reset select width
				//$("#characterSelector").width($(".selectContainer").width());

				// set default values for each trait category
				
				// might
				var defaultSelector = '#might >.trait:nth-child('+ (eval(curCharacter.might.default) + 1) + ')';

				$(defaultSelector).attr('id', 'default');

				// speed
				defaultSelector = '#speed >.trait:nth-child('+ (eval(curCharacter.speed.default) + 1) + ')';

				$(defaultSelector).attr('id', 'default');

				// sanity
				defaultSelector = '#sanity >.trait:nth-child('+ (eval(curCharacter.sanity.default) + 1) + ')';

				$(defaultSelector).attr('id', 'default');

				// knowledge
				defaultSelector = '#knowledge >.trait:nth-child('+ (eval(curCharacter.knowledge.default) + 1) + ')';

				$(defaultSelector).attr('id', 'default');

				//change all trait values

				// might
				$('#might >.trait').each(function(index)
				{
					$(this).html(curCharacter.might.value[index]);
				});

				// speed
				$('#speed >.trait').each(function(index)
				{
					$(this).html(curCharacter.speed.value[index]);
				});

				// sanity
				$('#sanity >.trait').each(function(index)
				{
					$(this).html(curCharacter.sanity.value[index]);
				});

				// knowledge
				$('#knowledge >.trait').each(function(index)
				{
					$(this).html(curCharacter.knowledge.value[index]);
				});

				setupTraitClicks();

				// if we have previously stored values, select those
				if(localStorage.currentTraitValues)
				{
					var parsedOb = JSON.parse(localStorage.currentTraitValues)
					for(var key in parsedOb)
					{
						$('#' + key +' >.trait:nth-child('+ (eval(parsedOb[key]) + 1) + ')').click();
					}
				}
				else
				{
					// otherwise, initialize the default traits as selected
					$('#default.trait').each(function(index)
					{
						$(this).click();
					});
				}
				

				centerAllHandles();

			}

			function setupTraitClicks()
			{
				$('.trait').each(function(index)
			    { 
			    	calculateCenter(this);

					$(this).click(function()
					{
						var parentID = $(this).parent().attr('id');

						var curTrait = currentTraits[parentID];

						if(curTrait != this)
						{

							$(curTrait).removeClass("selected");
							
							currentTraits[parentID] = this;
						}
						
						// save the new values to localStorage
						localStorage.setItem('characterIndex', $("#characterSelector option:selected").val());

						// store only the indices of our currentTraits
						
						var storedTraits = {might: $('#might >.trait').index(currentTraits["might"]),
											speed: $('#speed >.trait').index(currentTraits["speed"]),
											sanity: $('#sanity >.trait').index(currentTraits["sanity"]),
											knowledge: $('#knowledge >.trait').index(currentTraits["knowledge"])};

						localStorage.setItem('currentTraitValues', JSON.stringify(storedTraits));

						centerParentHandle(this);
					});
			    });
			}

			function handleAnimationComplete(event)
			{
				$(event.target).css('visibility', 'visible');
				$(currentTraits[$(event.target).attr('id')]).addClass("selected");
			}

			function centerAllHandles()
			{
				$('.trait.selected').each(function()
				{
					centerParentHandle(this);
				});
			}

			function centerParentHandle(element)
			{
				element.handle.css('left', element.position.left);
				element.handle.css('top', element.position.top);
			}

			function calculateCenter(element)
			{
				var parentID = $(element).parent().attr('id');

		    	var handleSelector = "#"+parentID+".handle";

		    	var handle = $(handleSelector);

		    	var t_offset = $(element).offset();

		    	var wDiff = ((handle.width()-$(element).width())/2) - 1;
		    	var hDiff = ((handle.height()-$(element).height())/2) - 3;

		    	element.position = { left: t_offset.left-wDiff, top: t_offset.top-hDiff };
		    	element.handle = handle;
			}
