$(function(){
	$('#house , #island').animate({bottom: 0},300,function(){
		$('#moon-orbit,#moon').addClass('ani');
		setTimeout("$('#bat-1').show().animate({bottom: 700, left: '120%'},2500).fadeOut(0);",1000);
		setTimeout("$('#bat-2').show().animate({bottom: 800, left: '110%'},2500).fadeOut(0);",900);
		setTimeout("$('#bat-3').show().animate({bottom: 900, left: '100%'},2500).fadeOut(0);",800);
		setTimeout("$('#cloud,#cloud2').addClass('ani');clearInterval(batAsas);",1800);
	});
});

function bat()
{
	$('.bat').toggleClass('fly');	
}
