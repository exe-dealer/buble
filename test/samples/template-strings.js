module.exports = [
	{
		description: 'transpiles an untagged template literal',
		input: 'var str = `foo${bar}baz`;',
		output: `var str = "foo" + bar + "baz";`
	},

	{
		description: 'handles arbitrary whitespace inside template elements',
		input: 'var str = `foo${ bar }baz`;',
		output: `var str = "foo" + bar + "baz";`
	},

	{
		description:
			'transpiles an untagged template literal containing complex expressions',
		input: 'var str = `foo${bar + baz}qux`;',
		output: `var str = "foo" + (bar + baz) + "qux";`
	},

	{
		description: 'transpiles a template literal containing single quotes',
		input: "var singleQuote = `'`;",
		output: `var singleQuote = "'";`
	},

	{
		description: 'transpiles a template literal containing double quotes',
		input: 'var doubleQuote = `"`;',
		output: `var doubleQuote = "\\"";`
	},

	{
		description: 'does not transpile tagged template literals',
		input: 'var str = x`y`',
		error: /Transforming tagged template strings is not fully supported/
	},

	{
		description:
			'transpiles tagged template literals with `transforms.dangerousTaggedTemplateString = true`',
		options: { transforms: { dangerousTaggedTemplateString: true } },
		input: 'var str = x`y${(() => 42)()}`;',
		output: `var templateObject = Object.freeze(["y", ""]);\nvar str = x(templateObject, (function () { return 42; })());`
	},

	{
		description:
			'transpiles tagged template literals with `transforms.dangerousTaggedTemplateString = true`',
		options: { transforms: { dangerousTaggedTemplateString: true } },
		input: 'var str = x`${(() => 42)()}y`;',
		output: `var templateObject = Object.freeze(["", "y"]);\nvar str = x(templateObject, (function () { return 42; })());`
	},

	{
		description: 'reuses quasi array for identical tagged template strings',
		options: { transforms: { dangerousTaggedTemplateString: true } },
		input: 'x`a${a}b`, x`a${b}b`, x`b${c}a`',
		output: `var templateObject$1 = Object.freeze(["b", "a"]);\nvar templateObject = Object.freeze(["a", "b"]);\nx(templateObject, a), x(templateObject, b), x(templateObject$1, c)`
	},

	{
		description: 'reuses quasi array for identical tagged template strings in strict mode',
		options: { transforms: { dangerousTaggedTemplateString: true } },
		input: '"use strict";\nx`a${a}b`, x`a${b}b`, x`b${c}a`',
		output: `"use strict";\nvar templateObject$1 = Object.freeze(["b", "a"]);\nvar templateObject = Object.freeze(["a", "b"]);\nx(templateObject, a), x(templateObject, b), x(templateObject$1, c)`
	},

	{
		description: 'parenthesises template strings as necessary',
		input: 'var str = `x${y}`.toUpperCase();',
		output: 'var str = ("x" + y).toUpperCase();'
	},

	{
		description: 'does not parenthesise plain template strings',
		input: 'var str = `x`.toUpperCase();',
		output: 'var str = "x".toUpperCase();'
	},

	{
		description:
			'does not parenthesise template strings in arithmetic expressions',
		input: 'var str = `x${y}` + z; var str2 = `x${y}` * z;',
		output: 'var str = "x" + y + z; var str2 = ("x" + y) * z;'
	},

	{
		description: 'can be disabled with `transforms.templateString === false`',
		options: { transforms: { templateString: false } },
		input: 'var a = `a`, b = c`b`;',
		output: 'var a = `a`, b = c`b`;'
	},

	{
		description: 'skips leading empty string if possible',
		input: 'var str = `${a} ${b}`',
		output: 'var str = a + " " + b'
	},

	{
		description: 'includes leading empty string if necessary',
		input: 'var str = `${a}${b}`',
		output: 'var str = "" + a + b'
	},

	{
		description: 'closes parens if final empty string is omitted',
		input: 'var str = `1 + 1 = ${1 + 1}`;',
		output: 'var str = "1 + 1 = " + (1 + 1);'
	},

	{
		description: 'allows empty template string',
		input: 'var str = ``;',
		output: 'var str = "";'
	},

	{
		description: 'concats expression with variable',
		input: 'var str = `${a + b}${c}`;',
		output: 'var str = "" + (a + b) + c;'
	},

	{
		description: 'interpolations inside interpolations',
		input: 'var string = `foo${`${bar}`}`',
		output: `var string = "foo" + ("" + bar)`
	}
];
