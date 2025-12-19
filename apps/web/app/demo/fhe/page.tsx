'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import {
  encryptAmount,
  decryptAmount,
  checkFHEHealth,
  formatAmount,
  validateAmount,
  FHEError,
} from '@/lib/fhe-utils';

export default function FHEDemoPage() {
  const { toast } = useToast();
  const [amount, setAmount] = useState('100.50');
  const [ciphertext, setCiphertext] = useState<string | null>(null);
  const [decryptedAmount, setDecryptedAmount] = useState<number | null>(null);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isHealthChecking, setIsHealthChecking] = useState(false);
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [useFHE, setUseFHE] = useState(true);

  const handleCheckHealth = async () => {
    setIsHealthChecking(true);
    try {
      const healthy = await checkFHEHealth();
      setIsHealthy(healthy);
      if (healthy) {
        toast.success('FHE 服务正常', 'FHE 服务运行正常，可以进行加密/解密操作');
      } else {
        toast.error('FHE 服务不可用', '请确保 FHE 服务正在运行（http://localhost:8001）');
      }
    } catch (error) {
      setIsHealthy(false);
      toast.error('健康检查失败', error instanceof Error ? error.message : '未知错误');
    } finally {
      setIsHealthChecking(false);
    }
  };

  const handleEncrypt = async () => {
    const amountNum = parseFloat(amount);
    const validation = validateAmount(amountNum);

    if (!validation.isValid) {
      toast.error('验证失败', validation.error || '金额格式不正确');
      return;
    }

    setIsEncrypting(true);
    setCiphertext(null);
    setDecryptedAmount(null);

    try {
      const encrypted = await encryptAmount(amountNum);
      setCiphertext(encrypted);
      toast.success('加密成功', `金额 ${formatAmount(amountNum)} 已加密`);
    } catch (error) {
      if (error instanceof FHEError) {
        toast.error('加密失败', error.message);
      } else {
        toast.error('加密失败', error instanceof Error ? error.message : '未知错误');
      }
    } finally {
      setIsEncrypting(false);
    }
  };

  const handleDecrypt = async () => {
    if (!ciphertext) {
      toast.error('没有密文', '请先加密一个金额');
      return;
    }

    setIsDecrypting(true);
    setDecryptedAmount(null);

    try {
      const decrypted = await decryptAmount(ciphertext);
      setDecryptedAmount(decrypted);
      toast.success('解密成功', `解密金额: ${formatAmount(decrypted)}`);
    } catch (error) {
      if (error instanceof FHEError) {
        toast.error('解密失败', error.message);
      } else {
        toast.error('解密失败', error instanceof Error ? error.message : '未知错误');
      }
    } finally {
      setIsDecrypting(false);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-10">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">FHE 加密/解密演示</h1>
        <p className="text-sm text-muted-foreground">
          测试 FHE（全同态加密）服务的加密和解密功能
        </p>
      </section>

      {/* Health Check */}
      <Card>
        <CardHeader>
          <CardTitle>服务状态</CardTitle>
          <CardDescription>检查 FHE 服务是否可用</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">
                服务状态:{' '}
                {isHealthy === null
                  ? '未检查'
                  : isHealthy
                  ? '✅ 正常'
                  : '❌ 不可用'}
              </p>
              <p className="text-xs text-muted-foreground">
                FHE API: http://localhost:8001
              </p>
            </div>
            <Button onClick={handleCheckHealth} disabled={isHealthChecking}>
              {isHealthChecking ? '检查中...' : '检查服务'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Encryption */}
      <Card>
        <CardHeader>
          <CardTitle>加密金额</CardTitle>
          <CardDescription>输入金额进行 FHE 加密</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">金额 (USD)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              max="999999.99"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="例如: 100.50"
            />
            <p className="text-xs text-muted-foreground">
              支持范围: $0.01 - $999,999.99，最多 2 位小数
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="use-fhe"
              checked={useFHE}
              onCheckedChange={setUseFHE}
            />
            <Label htmlFor="use-fhe" className="text-sm">
              使用 FHE 加密（如果服务不可用，将使用占位符模式）
            </Label>
          </div>
          <Button onClick={handleEncrypt} disabled={isEncrypting}>
            {isEncrypting ? '加密中...' : '加密'}
          </Button>
          {ciphertext && (
            <div className="space-y-2 rounded-lg bg-muted p-4">
              <p className="text-sm font-medium">加密结果 (Base64):</p>
              <p className="font-mono text-xs break-all">{ciphertext}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Decryption */}
      <Card>
        <CardHeader>
          <CardTitle>解密金额</CardTitle>
          <CardDescription>解密之前加密的金额</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleDecrypt} disabled={isDecrypting || !ciphertext}>
            {isDecrypting ? '解密中...' : '解密'}
          </Button>
          {decryptedAmount !== null && (
            <div className="space-y-2 rounded-lg bg-muted p-4">
              <p className="text-sm font-medium">解密结果:</p>
              <p className="text-2xl font-bold">{formatAmount(decryptedAmount)}</p>
              {ciphertext && (
                <p className="text-xs text-muted-foreground">
                  原始金额: {formatAmount(parseFloat(amount))} | 解密金额:{' '}
                  {formatAmount(decryptedAmount)} |{' '}
                  {Math.abs(decryptedAmount - parseFloat(amount)) < 0.01
                    ? '✅ 匹配'
                    : '❌ 不匹配'}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info */}
      <Card>
        <CardHeader>
          <CardTitle>关于 FHE</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>FHE（全同态加密）</strong>允许在不解密数据的情况下对加密数据进行计算。
          </p>
          <p>
            在这个演示中，您可以：
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>加密支付金额</li>
            <li>解密加密后的金额</li>
            <li>验证加密/解密流程</li>
          </ul>
          <p className="mt-4">
            <strong>注意：</strong>如果 FHE 服务不可用，系统将使用占位符模式进行演示。
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

