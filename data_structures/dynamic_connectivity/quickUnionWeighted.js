// NOTES: weighting means deepest node will be at most lg n

function quickUnionWeighted(n) {
	// create object to be returned
	var quickUnionObj = {
		ids: [],
		size: []
	};

	// fill id array with values equal to indices
	// fill size array with starting value of 1
	for (var i = 0; i <= n; i++) {
		quickUnionObj.ids[i] = i;
		quickUnionObj.size[i] = 1;
	}

	// method for finding root node of component tree
	quickUnionObj.root = function(i) {
		// chase parent pointers until root is reached
		while (i !== this.ids[i]) {
			i = this.ids[i];
		}
		return i;
	}

	// method to check if nodes are connected
	quickUnionObj.connected = function(nodeOne, nodeTwo) {
		return this.root(nodeOne) === this.root(nodeTwo);
	}

	// method to connect nodes
	quickUnionObj.union = function(nodeOne, nodeTwo) {
		var nodeOneRoot = this.root(nodeOne);
		var nodeTwoRoot = this.root(nodeTwo);
		
		// if nodes share same root, they're already connected
		if (nodeOneRoot === nodeTwoRoot) return;
		
		// connect trees based on size (root of smaller tree connects to root of larger tree)
		// then update the size array of the larger tree's root
		if (this.size[nodeOneRoot] < this.size[nodeTwoRoot]) {
			this.ids[nodeOneRoot] = nodeTwoRoot;
			this.size[nodeTwoRoot] += this.size[nodeOneRoot];
		} else {
			this.ids[nodeTwoRoot] = nodeOneRoot;
			this.size[nodeOneRoot] += this.size[nodeTwoRoot];
		}
	}
	
	return quickUnionObj;
}

module.exports = quickUnionWeighted;