/**
 * Transaction Checker Script
 * Check transaction details on Base Sepolia
 */

import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';

const RPC_URL = 'https://sepolia.base.org';

async function checkTransaction(txHash: string) {
  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(RPC_URL),
  });

  console.log(`\n🔍 分析交易: ${txHash}\n`);

  try {
    // Get transaction receipt
    const receipt = await publicClient.getTransactionReceipt({
      hash: txHash as `0x${string}`,
    });

    console.log('📋 交易详情:');
    console.log(`   状态: ${receipt.status === 'success' ? '✅ 成功' : '❌ 失败'}`);
    console.log(`   区块号: ${receipt.blockNumber}`);
    console.log(`   From: ${receipt.from}`);
    console.log(`   To: ${receipt.to || '合约创建'}`);
    console.log(`   Gas Used: ${receipt.gasUsed.toString()}`);

    // Check contract addresses
    const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e';
    const FHE_GATEWAY_ADDRESS = '0x21834a2D140C4A2Ba31E88f1abF2e1E9b021625e';

    if (receipt.to?.toLowerCase() === USDC_ADDRESS.toLowerCase()) {
      console.log('\n💰 交易类型: x402 支付交易（USDC 转账）');
    } else if (receipt.to?.toLowerCase() === FHE_GATEWAY_ADDRESS.toLowerCase()) {
      console.log('\n🔐 交易类型: FHE 存储交易（加密金额存储）');
    } else {
      console.log('\n❓ 交易类型: 未知');
    }

    // Check events
    console.log('\n📊 事件日志:');
    if (receipt.logs.length === 0) {
      console.log('   无事件日志');
    } else {
      receipt.logs.forEach((log, index) => {
        console.log(`   事件 ${index + 1}:`);
        console.log(`     地址: ${log.address}`);
        console.log(`     Topics: ${log.topics.length} 个`);
      });
    }

    // Get transaction details
    const tx = await publicClient.getTransaction({
      hash: txHash as `0x${string}`,
    });

    console.log('\n📝 交易输入数据:');
    if (tx.input && tx.input !== '0x') {
      console.log(`   长度: ${tx.input.length} 字符`);
      console.log(`   前 20 字符: ${tx.input.substring(0, 20)}...`);
    } else {
      console.log('   无输入数据（ETH 转账）');
    }

    console.log(`\n🔗 Basescan 链接:`);
    console.log(`   https://sepolia.basescan.org/tx/${txHash}\n`);

    return {
      success: receipt.status === 'success',
      type: receipt.to?.toLowerCase() === USDC_ADDRESS.toLowerCase() 
        ? 'x402_payment' 
        : receipt.to?.toLowerCase() === FHE_GATEWAY_ADDRESS.toLowerCase()
        ? 'fhe_storage'
        : 'unknown',
      receipt,
      tx,
    };
  } catch (error) {
    console.error('❌ 获取交易失败:', error);
    throw error;
  }
}

// Main
const txHash = process.argv[2];
if (!txHash) {
  console.error('请提供交易哈希作为参数');
  console.log('用法: tsx scripts/check-transaction.ts <txHash>');
  process.exit(1);
}

checkTransaction(txHash)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

