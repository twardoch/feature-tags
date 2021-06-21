Handlebars.registerHelper("ifEquals", function (arg1, arg2, options) {
	return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper("ifIncludes", function (arg1, arg2, options) {
	return arg1.includes(arg2) ? options.fn(this) : options.inverse(this);
});

var featureTemplate = Handlebars.compile(`
	<div class="feature">
		<a name="{{tag}}"><h2> {{tag}}: {{feature.title}} </h2></a>

		{{#ifEquals feature.state "required"}}
			<div class="tooltip" data-text="Required feature: It's on, and you can't turn it off.">
			<span class="material-icons-outlined">check_circle</span>
			</div>
		{{/ifEquals}}

		{{#ifEquals feature.state "discretionary"}}
			<div class="tooltip" data-text="Discretionary feature: It's off, but can turn it on.">
			<span class="material-icons-outlined">toggle_off</span>
			</div>
		{{/ifEquals}}

		{{#ifEquals feature.state "default"}}
			<div class="tooltip" data-text="Default feature: It's on, but can turn it off.">
			<span class="material-icons-outlined">toggle_on</span>
			</div>
		{{/ifEquals}}

		{{#if feature.automatic}}
			<div class="tooltip" data-text="This feature is usually generated by your font editor.">
			<span class="material-icons-outlined">smart_toy</span>
			</div>
		{{/if}}

		{{#if feature.popularity_ix}}
			<div class="tooltip" data-text="This feature is {{feature.popularity}}.">
			{{{feature.stars}}}
			</div>
		{{else}}
			<div class="tooltip" data-text="This feature is {{feature.popularity}}.">
			<span class="material-icons-outlined">star_outline</span>
			</div>
		{{/if}}

		{{#if feature.script}}
			{{{feature.html_scripts}}}
		{{else}}
		<div class="tooltip" data-text="This feature applies to all scripts.">
			<span class="material-icons-outlined">public</span>
			</div>
		{{/if}}


		{{#ifEquals feature.status "deprecated"}}
			<div class="tooltip" data-text="This feature is deprecated.">
			<span class="material-icons-outlined">sick</span>
			</div>
		{{/ifEquals}}

		{{#ifEquals feature.status "discouraged"}}
			<div class="tooltip" data-text="This feature is discouraged.">
			<span class="material-icons-outlined">sentiment_dissatisfied</span>
			</div>
		{{/ifEquals}}


		{{#ifEquals feature.registered "Microsoft"}}
		<div class="tooltip" data-text="This feature was registered by Microsoft.">
			<span class="material-icons-outlined microsoft">window</span>
			</div>
		{{/ifEquals}}

		{{#ifEquals feature.registered "Adobe"}}
		<div class="tooltip" data-text="This feature was registered by Adobe.">
			<span class="adobe">A</span>
		</div>
		{{/ifEquals}}

		{{#ifIncludes feature.registered "Tiro"}}
		<div class="tooltip" data-text="This feature was registered by Tiro Typeworks.">
			<span class="tiro">T</span>
		</div>
		{{/ifIncludes}}
		{{{ feature.html_description }}}

		{{#if feature.example}}
		{{#if feature.example.math}}
		<details open>
				<summary>Example</summary>
	  <div class="row">
	  <div class="five columns">
	  	Off:
			<span class="example-off" style="font-feature-settings: '{{tag}}' 0;">
	      <math xmlns="http://www.w3.org/1998/Math/MathML">
	         <mrow>
						{{{feature.example.math}}}
						</mrow>
				</math>
			</span>
		</div>

	  <div class="five columns">
	  	On:
			<span class="example-on">
	      <math xmlns="http://www.w3.org/1998/Math/MathML">
	         <mrow>
						{{{feature.example.math}}}
						</mrow>
				</math>
			</span>
		</div>
		</div>
			<div class="warning"> The above example contains MathML, which currently
			only renders reliably using Firefox.</div>
		</details>
		{{else}}
		<details open>
				<summary>Example</summary>
	  <div class="row">
	  <div class="five columns">
	  	Off:
			<span class="example-off" style="font-family: '{{feature.example.font}}'; font-feature-settings: '{{tag}}' 0;">
				{{feature.example.text}}
			</span>
		</div>

	  <div class="five columns">
	  	On:
			<span class="example-on" style="font-family: '{{feature.example.font}}'; font-feature-settings: '{{tag}}' 1;">
				{{feature.example.text}}
			</span>
		</div>
		</div>

		{{#ifEquals feature.state "required"}}
		{{#if safari}}
			<div class="warning"> Safari does not allow required features to be turned off,
			so this example may not show any distinction between the "off" and "on" state.
			Try viewing this example in Firefox or Chrome instead.</div>
		{{/if}}
		{{/ifEquals}}

		</details>

		{{/if}}
		{{/if}}

		{{#if feature.fea}}
			<details open>
				<summary>Example Feature Code Implementation</summary>
				<pre><code class="language-fea">{{feature.fea}}</code></pre>
			</details>
		{{/if}}

		{{#if feature.ui}}
			<details open>
			<summary>User-Interface expectations</summary>
			<div class="ui">
				{{{feature.html_ui}}}
			</div>
			</details>
		{{/if}}

		<dl>
			{{#if feature.group}}
			<dt>Group:</dt><dd>{{feature.group}}</dd>
			{{/if}}
		</dl>

	</div>
`);

function renderAll() {
	$("#features").empty();
	console.log("Rendering");
	var tagfilter = $("#tag-filter").val();
	tags = Object.keys(window.featuredb);

	tags.sort();

	for (tag of tags) {
		if (tagfilter && !tag.includes(tagfilter)) {
			continue;
		}

		feat = window.featuredb[tag];
		if (!feat.stars) {
			feat.stars = `<span class="material-icons-outlined">star</span>`.repeat(
				feat.popularity_ix
			);
		}

		if (!feat.html_description) {
			feat.html_description = marked(feat.description);
		}

		if (!feat.html_ui && feat.ui) {
			feat.html_ui = marked(feat.ui);
		}

		if (!feat.html_scripts) {
			feat.html_scripts = scriptsFor(feat);
		}

		var featurediv = $(
			featureTemplate({ tag: tag, feature: feat, safari: window.safari })
		);
		$("#features").append(featurediv);
	}
}

$(function () {
	renderAll();
	console.log($("#tag-filter"));
	$("#tag-filter").on("change keyup paste", function () {
		renderAll();
	});
});
