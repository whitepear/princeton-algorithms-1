'use strict';
var factoryQueue = require('../stacks_queues/arrayQueue.js');

var protoBinarySearchTree = {
	get: function(val) {
		var currentNode = this.root;
		// traverse the tree in search of val
		while (currentNode !== null) {
			// comparison code
			if (val < currentNode.val) currentNode = currentNode.left;
			if (val > currentNode.val) currentNode = currentNode.right;
			else return currentNode;
		}
		// if no node was found, return null
		return null;
	},
	insert: function(val) {
		// insert val into tree
		this.root = insert.call(this, this.root, val);

		function insert(currentNode, val) {
			// if empty tree, return a new node
			if (currentNode === null) return factoryNode(val);
			
			if (val < currentNode.val) {
				currentNode.left = insert.call(this, currentNode.left, val);
			} else if (val > currentNode.val) {
				currentNode.right = insert.call(this, currentNode.right, val);
			} else {
				currentNode.val = val;
			}

			// update node count
			currentNode.count = 1 + this.size(currentNode.left) + this.size(currentNode.right);

			return currentNode;
		}
	},	
	min: function(rootNode) {
		// get min val in tree/sub-tree
		if (this.root !== null) {	
			var currentNode = rootNode || this.root;		
			while (currentNode.left !== null) {
				currentNode = currentNode.left;
			}
			return currentNode;
		}
		return null;
	},
	max: function(rootNode) {
		// get max val in tree/sub-tree
		if (this.root !== null) {
			var currentNode = rootNode || this.root;
			while (currentNode.right !== null) {
				currentNode = currentNode.right;
			}
			return currentNode;
		}
		return null;
	},
	floor: function(val) {
		// find the largest val <= to a given val
		var floorNode = floor(this.root, val);
		if (floorNode === null) return null;
		return floorNode.val;
		
		function floor(x, val) {
			if (x === null) return null;

			if (val === x.val) return x;

			if (val < x.val) return floor(x.left, val);

			var t = floor(x.right, val);
			if (t !== null) return t;
			else 						return x;
		}
	},	
	size: function(node) {
		// find size of tree rooted at provided node
		if (node !== null && typeof node === 'object') return node.count; 
		// if size is called without argument, return the full tree size
		if (node === undefined && this.root) return this.root.count;
		// if the tree is empty return 0
		return 0;
	},
	rank: function(val) {
		// get number of nodes less than val
		return rank.call(this, val, this.root);

		function rank(val, currentNode) {
			if (currentNode === null) return 0;

			if (val < currentNode.val) return rank.call(this, val, currentNode.left);
			// if on right, add 1 for the root and add the 
			// size of the left-subtree of the root, in addition to 
			// the left-subtree size of the relevant node within the right-subtree
			else if (val > currentNode.val) return 1 + this.size(currentNode.left) + rank.call(this, val, currentNode.right);
			// if val is equal to currentNode's val, return the number of 
			// nodes in currentNode's left subtree
			else return this.size(currentNode.left);
		}
	},
	iterate: function() {
		// in-order iteration
		// produce queue of values within tree, sorted from min to max
		var queue = factoryQueue();
		iterate(this.root);
		return queue;

		function iterate(currentNode) {
			if (currentNode === null) return;
			iterate(currentNode.left);
			queue.enqueue(currentNode.val);
			iterate(currentNode.right);
		}
	},
	preOrder: function() {
		// produce queue of values within tree
		// in pre-order form
		var queue = factoryQueue();
		iterate(this.root);
		return queue;

		function iterate(currentNode) {
			if (currentNode === null) return;
			queue.enqueue(currentNode.val);
			iterate(currentNode.left);
			iterate(currentNode.right);
		}
	},
	postOrder: function() {
		// produce a queue of values within tree
		// in post-order form
		var queue = factoryQueue();
		iterate(this.root);
		return queue;

		function iterate(currentNode) {
			if (currentNode === null) return;
			iterate(currentNode.left);
			iterate(currentNode.right);
			queue.enqueue(currentNode.val);
		}
	},
	deleteMin: function() {
		if (this.root !== null) {
			this.root = deleteMin.call(this, this.root);
			
			function deleteMin(currentNode) {
				if (currentNode.left === null) return currentNode.right;
				currentNode.left = deleteMin.call(this, currentNode.left);
				currentNode.count = 1 + this.size(currentNode.left) + this.size(currentNode.right);
				return currentNode;
			}
		} else {
			return null;
		}
	},
	deleteNode: function(node) {
		this.root = deleteNode.call(this, this.root, node);

		function deleteNode(x, nodeToDelete) {
			if (x === null) return null;
			// search for node
			if (nodeToDelete < x.val) x.left = deleteNode.call(this, x.left, nodeToDelete);
			else if (nodeToDelete > x.val) x.right = deleteNode.call(this, x.right, nodeToDelete);
			else {
				// no right/left child
				if (x.right === null) return x.left;
				if (x.left  === null) return x.right;
				
				// replace with successor
				var t = x;
				x = this.min(t.right);
				x.right = deleteMin.call(this, t.right);
				x.left = t.left; 
			}
			// update subtree counts
			x.count = this.size(x.left) + this.size(x.right) + 1;
			return x;
		}

		function deleteMin(currentNode) {
			if (currentNode.left === null) return currentNode.right;
			currentNode.left = deleteMin.call(this, currentNode.left);
			currentNode.count = 1 + this.size(currentNode.left) + this.size(currentNode.right);
			return currentNode;
		}
	}
};

function factoryNode(val) {
	return {
		val: val,
		count: 1,
		left: null,
		right: null
	};
}

function factoryBinarySearchTree() {
	var binarySearchTree = Object.create(protoBinarySearchTree);
	binarySearchTree.root = null;
	return binarySearchTree;
}


// Tests
var test = factoryBinarySearchTree();
console.log('Initial tree: ', test);
console.log('Empty size check: ', test.size());
console.log('Empty get check: ', test.get(2));
console.log('Empty min check: ', test.min());
console.log('Empty max check: ', test.max());
console.log('Empty floor check: ', test.floor(5));
console.log('Empty rank check: ', test.rank(10));
console.log('Empty deleteMin check: ', test.deleteMin());
console.log('Empty deleteNode check: ', test.deleteNode(3));
test.insert(5);
test.insert(2);
test.insert(14);
test.insert(4);
test.insert(0);
test.insert(8);
test.insert(10);
test.insert(6);
console.log('Tree after 8 inserts: ', JSON.stringify(test, null, 2));
console.log('Queue produced by iterate call: ', test.iterate());
console.log('Pre-order traversal check: ', test.preOrder());
console.log('Post-order traversal check: ', test.postOrder());
console.log('Valid get check: ', test.get(5));
console.log('Invalid get check: ', test.get(925));
console.log('Min check: ', test.min());
console.log('Max check: ', test.max());
console.log('Floor check (3): ', test.floor(3));
console.log('Floor check (14): ', test.floor(14));
console.log('Rank check (12): ', test.rank(12));
console.log('Rank check (5): ', test.rank(5));
console.log('Size check: ', test.size());
test.deleteMin();
console.log('Post-deleteMin size check: ', test.size());
console.log('Post-deleteMin min check: ', test.min());
test.deleteNode(8);
console.log('Post-deleteNode (8) size check: ', test.size());
console.log('Post-deleteNode (8) rank (12) check: ', test.rank(12));
console.log('Post-deleteNode (8) check: ', JSON.stringify(test, null, 2));
