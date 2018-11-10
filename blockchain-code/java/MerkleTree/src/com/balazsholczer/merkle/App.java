package com.balazsholczer.merkle;

import java.util.ArrayList;
import java.util.List;

public class App {

	public static void main(String[] args) {
		
		/*
		 * Why to use Merkle Trees?
		 *   --> because we can represent all the transactions within a 
		 *           block by a single hash 
		 *   --> this single hash is in the header of the block in the blockchain
		 *   		(so it is an memory efficient solution)
		 *   --> this is the merkle root: we recursively keep hashing the leaf nodes
		 *   		in the tree-like structure
		 *   
		 *   THE ROOT CAN VERIFY THAT ALL THE TRANSACTIONS ARE VALID IN THE BLOCK !!!
		 */
		
		List<String> transactions = new ArrayList<>();
		transactions.add("aa");
		transactions.add("bb");
		transactions.add("dd");
		transactions.add("ee");
		transactions.add("11");
		transactions.add("22");
		transactions.add("33");
		transactions.add("44");
		transactions.add("55");
		
		MerkleTree merkleTree = new MerkleTree(transactions);
		System.out.println(merkleTree.getMerkeRoot().get(0));
		
	}
}
