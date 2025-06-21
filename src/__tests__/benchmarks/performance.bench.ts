import { DopplerClient } from '../../doppler-client';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

/**
 * Performance benchmarks for Doppler MCP Server
 * 
 * Run with: npm run benchmark
 */

interface BenchmarkResult {
  operation: string;
  iterations: number;
  totalTime: number;
  avgTime: number;
  minTime: number;
  maxTime: number;
  opsPerSecond: number;
}

class PerformanceBenchmark {
  private client: DopplerClient;
  private results: BenchmarkResult[] = [];

  constructor(token: string) {
    this.client = new DopplerClient(token);
  }

  private async measure(fn: () => Promise<any>): Promise<number> {
    const start = process.hrtime.bigint();
    await fn();
    const end = process.hrtime.bigint();
    return Number(end - start) / 1_000_000; // Convert to milliseconds
  }

  private async benchmark(
    name: string,
    fn: () => Promise<any>,
    iterations: number = 100
  ): Promise<BenchmarkResult> {
    console.log(`\nRunning benchmark: ${name}`);
    console.log(`Iterations: ${iterations}`);
    
    const times: number[] = [];
    
    // Warmup
    console.log('Warming up...');
    for (let i = 0; i < 5; i++) {
      await fn();
    }
    
    // Actual benchmark
    console.log('Benchmarking...');
    const progressInterval = Math.max(1, Math.floor(iterations / 10));
    
    for (let i = 0; i < iterations; i++) {
      if (i % progressInterval === 0) {
        process.stdout.write(`\rProgress: ${Math.round((i / iterations) * 100)}%`);
      }
      
      const time = await this.measure(fn);
      times.push(time);
    }
    
    process.stdout.write('\rProgress: 100%\n');
    
    // Calculate statistics
    const totalTime = times.reduce((a, b) => a + b, 0);
    const avgTime = totalTime / iterations;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const opsPerSecond = 1000 / avgTime;
    
    const result: BenchmarkResult = {
      operation: name,
      iterations,
      totalTime,
      avgTime,
      minTime,
      maxTime,
      opsPerSecond,
    };
    
    this.results.push(result);
    return result;
  }

  async runBenchmarks(testProject: string, testConfig: string) {
    console.log('🚀 Starting Doppler MCP Server Performance Benchmarks\n');
    console.log(`Project: ${testProject}`);
    console.log(`Config: ${testConfig}`);
    console.log('='.repeat(50));

    // Benchmark: List Projects
    await this.benchmark('List Projects', 
      () => this.client.listProjects(),
      50
    );

    // Benchmark: List Configs
    await this.benchmark('List Configs',
      () => this.client.listConfigs(testProject),
      100
    );

    // Benchmark: List Secrets
    await this.benchmark('List Secrets',
      () => this.client.listSecrets(testProject, testConfig),
      100
    );

    // Benchmark: Get Single Secret
    const testSecretName = 'BENCHMARK_TEST';
    
    // Ensure test secret exists
    await this.client.setSecret(testProject, testConfig, testSecretName, 'benchmark-value');
    
    await this.benchmark('Get Single Secret',
      () => this.client.getSecret(testProject, testConfig, testSecretName),
      200
    );

    // Benchmark: Set Secret
    let counter = 0;
    await this.benchmark('Set Secret',
      () => this.client.setSecret(
        testProject,
        testConfig,
        `BENCHMARK_${counter++}`,
        `value-${counter}`
      ),
      50
    );

    // Benchmark: Concurrent Operations
    await this.benchmark('Concurrent List Operations (x5)',
      () => Promise.all([
        this.client.listSecrets(testProject, testConfig),
        this.client.listSecrets(testProject, testConfig),
        this.client.listSecrets(testProject, testConfig),
        this.client.listSecrets(testProject, testConfig),
        this.client.listSecrets(testProject, testConfig),
      ]),
      20
    );

    // Cleanup
    console.log('\nCleaning up test secrets...');
    const secretsToDelete = Array.from({ length: counter }, (_, i) => `BENCHMARK_${i}`);
    secretsToDelete.push(testSecretName);
    
    // Delete in batches to avoid rate limits
    const batchSize = 10;
    for (let i = 0; i < secretsToDelete.length; i += batchSize) {
      const batch = secretsToDelete.slice(i, i + batchSize);
      await this.client.deleteSecrets(testProject, testConfig, batch);
    }

    this.printResults();
  }

  private printResults() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 BENCHMARK RESULTS');
    console.log('='.repeat(80));
    
    const header = '| Operation | Iterations | Avg (ms) | Min (ms) | Max (ms) | Ops/sec |';
    const separator = '|' + '-'.repeat(78) + '|';
    
    console.log(header);
    console.log(separator);
    
    this.results.forEach(result => {
      const row = [
        result.operation.padEnd(35),
        result.iterations.toString().padStart(10),
        result.avgTime.toFixed(2).padStart(8),
        result.minTime.toFixed(2).padStart(8),
        result.maxTime.toFixed(2).padStart(8),
        result.opsPerSecond.toFixed(1).padStart(8),
      ].join(' | ');
      
      console.log(`| ${row} |`);
    });
    
    console.log('='.repeat(80));
    
    // Summary statistics
    console.log('\n📈 SUMMARY');
    console.log('-'.repeat(40));
    
    const totalOps = this.results.reduce((sum, r) => sum + r.iterations, 0);
    const totalTime = this.results.reduce((sum, r) => sum + r.totalTime, 0);
    
    console.log(`Total operations: ${totalOps}`);
    console.log(`Total time: ${(totalTime / 1000).toFixed(2)}s`);
    console.log(`Average ops/sec: ${(totalOps / (totalTime / 1000)).toFixed(1)}`);
    
    // Performance grades
    console.log('\n🏆 PERFORMANCE GRADES');
    console.log('-'.repeat(40));
    
    this.results.forEach(result => {
      let grade = 'A+';
      if (result.avgTime > 10) grade = 'A';
      if (result.avgTime > 25) grade = 'B';
      if (result.avgTime > 50) grade = 'C';
      if (result.avgTime > 100) grade = 'D';
      if (result.avgTime > 200) grade = 'F';
      
      console.log(`${result.operation}: ${grade}`);
    });
  }
}

// Main execution
async function main() {
  const token = process.env.DOPPLER_TEST_TOKEN;
  const testProject = process.env.DOPPLER_TEST_PROJECT || 'mcp-test';
  const testConfig = process.env.DOPPLER_TEST_CONFIG || 'development';
  
  if (!token || process.env.RUN_BENCHMARKS !== 'true') {
    console.log('To run benchmarks:');
    console.log('1. Copy .env.test.example to .env.test');
    console.log('2. Add your DOPPLER_TEST_TOKEN');
    console.log('3. Run: RUN_BENCHMARKS=true npm run benchmark');
    process.exit(0);
  }
  
  try {
    const benchmark = new PerformanceBenchmark(token);
    await benchmark.runBenchmarks(testProject, testConfig);
    
    console.log('\n✅ Benchmarks completed successfully!');
  } catch (error) {
    console.error('\n❌ Benchmark failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}