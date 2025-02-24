import path from 'path'

export default {
	'*': (files) => {
		const cwd = process.cwd()

		const relativePaths = files.map((file) => path.relative(cwd, file))

		return [`prettier --write --ignore-unknown ${relativePaths.join(' ')}`]
	},
}
