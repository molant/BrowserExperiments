A repo of [BrowserExperiments.com](http://browserexperiments.com/)


# BrowserExperiments on GitHub

A collection of demos to test polyfills and shims. 


# Aim of BrowserExperiments

1. To provide working online demonstration of Shims and Polyfills
2. To show test results of the shims their suitability and performance
3. To be fully open source with MIT licences
4. To appropriatly accredit anyone who wants to chip-in


# Demos

2. Each demos should exist in a self contained .html file, ideally
3. Demos should take the default style as adopted by other demos


# TODO
There are a number of demos to create which would fill in the table on the homepage. 


# Contribute

	// Use the "fork" button on the BrowserExperiments github project page.
	// These instructions are modified from http://help.github.com/fork-a-repo/
	
	// Clone your new fork locally
	// repace username with your username

	git clone git@github.com:username/BrowserExperiments.git
	
	cd BrowserExperiments
	
	// Add remote addresses for contributing back to the main repo
	// Assigns the original repo to a remote called "upstream"

	git remote add upstream git://github.com/molant/BrowserExperiments.git
	
	// You should frequently update your fork with other commits in the main project with
	git fetch upstream
	git merge upstream/master


	// once you've made some commits you can push those back to the main project
	// this saves to your repo, the original repo, and the website
	git push origin master
	git push upstream
	git push upstream master:gh-pages

	// take good care and dont do evil