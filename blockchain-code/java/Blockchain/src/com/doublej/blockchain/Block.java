package com.doublej.blockchain;

import java.util.Date;

public class Block {

	private int id;
	private int nonce;
	private long timeStamp;
	private String hash;
	private String previousHash;
	private String transaction;
	
	public Block(int id, String transaction, String previousHash) {
		this.id = id;
		this.transaction = transaction;
		this.previousHash = previousHash;
		this.timeStamp = new Date().getTime();
		generateHash();
	}

	public void generateHash() {
		String dataToHash =
                        Integer.toString(id) +
				        previousHash +
                        Long.toString(timeStamp) +
                        Integer.toString(nonce) +
                        transaction.toString();
		this.hash = SHA256Helper.generateHash(dataToHash);
	}
	
	public String getHash() {
		return this.hash;
	}

	public void setHash(String hash) {
		this.hash = hash;
	}

	public String getPreviousHash() {
		return this.previousHash;
	}

	public void setPreviousHash(String previousHash) {
		this.previousHash = previousHash;
	}
	
	public void incrementNonce() {
		this.nonce++;
	}

	@Override
	public String toString() {
		return this.id+"-"+this.transaction+"-"+this.hash+"-"+this.previousHash+"-";
		
	}
}
