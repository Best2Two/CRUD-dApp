const TransactionRegistry = artifacts.require("TransactionRegistry");

contract("TransactionRegistry", (accounts) => {
  let registry;
  
  const user1 = accounts[0]; 
  const user2 = accounts[1];

  const operation = "CreateUser";
  const recordId = "User_101";
  const timestamp = 123456789;

  before(async () => {
    registry = await TransactionRegistry.deployed();
  });

  it("Should validate and record a new transaction", async () => {
    const result = await registry.validateTransaction(operation, recordId, timestamp, { from: user1 });

    const log = result.logs.find(e => e.event === "ValidationResult");
    
    assert.equal(log.args.success, true, "Transaction should be accepted");
    console.log("   ✅ First transaction accepted successfully");
  });

  it("Should return the correct signer address", async () => {
    const signer = await registry.getSigner(operation, recordId, timestamp);
    
    assert.equal(signer, user1, "Signer should be user1");
    console.log("   ✅ Signer recorded correctly: " + signer);
  });

  it("Should REJECT duplicate transaction", async () => {
    const result = await registry.validateTransaction(operation, recordId, timestamp, { from: user2 });

    const log = result.logs.find(e => e.event === "ValidationResult");
    
    assert.equal(log.args.success, false, "Duplicate transaction should be rejected");
    console.log("   ✅ Duplicate transaction blocked successfully");
  });
});
