/* Author: Jorge del Casar
 *
 */
(function(){
	prettyPrint();
	var $form = $('#config form').bind(
		'submit',
		function(event){
			event.preventDefault();
			var $magazine = $('#magazine');
			if( $magazine.data('magazinify') )
			{
				$magazine.magazinify('destroy');
			}
			$magazine.magazinify( $form.serializeObject() );
			$('#book_link').html('Magazine <span class="label notice">Maganizified</span>').click();
		}
	);
	$form.find('.reset').bind(
		'click',
		function()
		{
			var $magazine = $('#magazine');
			if( $magazine.data('magazinify') )
			{
				$magazine.magazinify('destroy');
			}
			$('#book_link').html('Magazine').click();
		}
	);
})();

$.fn.serializeObject = function()
{
	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {
		if (o[this.name] !== undefined)
		{
			if (!o[this.name].push)
			{
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		}
		else
		{
			o[this.name] = parseInt(this.value || '');
		}
	});
	return o;
};