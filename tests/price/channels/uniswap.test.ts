import BigNumber from 'bignumber.js';

import { UniswapV2, UniswapV3 } from '../../../src/price/channels/uniswap';

const uniToken: any = {
  chainCode: 'eth',
  code: 'eth_uni',
  tokenAddress: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
  decimals: 18,
};
const wethToken: any = {
  chainCode: 'eth',
  code: 'eth_weth',
  tokenAddress: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  decimals: 18,
};

const geth = {
  batchEthCall: jest.fn(),
};
const providerController: any = {
  getClient: jest.fn(),
};

beforeEach(() => {
  providerController.getClient.mockResolvedValue(geth);
});

const uniswapV2 = new UniswapV2(
  {
    eth: {
      router_address: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d', // RouterV2 Contract
      base_token_address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH
      media_token_addresses: [
        '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', // WBTC
        '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
      ],
    },
  },
  providerController,
);

const uniswapV3 = new UniswapV3(
  {
    eth: {
      quoter_address: '0xb27308f9f90d607463bb33ea1bebb41c27ce5ab6', // Quoter Contract
      base_token_address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH
      media_token_addresses: [
        '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', // WBTC
        '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
      ],
    },
  },
  providerController,
);

test('uniswap v2', async () => {
  geth.batchEthCall.mockResolvedValue([
    '0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000000000000000000000000000000014b4f12f855ab0',
    undefined, // maybe network error
    '0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000030000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000017235f20000000000000000000000000000000000000000000000000013dbbb3a7187bd',
  ]);

  await expect(uniswapV2.pricing([uniToken, wethToken])).resolves.toStrictEqual(
    [
      {
        coin: 'eth_weth',
        unit: 'eth',
        value: new BigNumber(1), // return directly
      },
      {
        coin: 'eth_uni',
        unit: 'eth',
        value: new BigNumber('0.005828447511599792'),
      },
    ],
  );
  expect(providerController.getClient).toHaveBeenCalledWith(
    'eth',
    expect.any(Function),
  );
  expect(geth.batchEthCall).toHaveBeenCalledWith([
    {
      to: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
      data: '0xd06ca61f0000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000020000000000000000000000001f9840a85d5af5bf1d1762f925bdaddc4201f984000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    },
    {
      to: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
      data: '0xd06ca61f0000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000030000000000000000000000001f9840a85d5af5bf1d1762f925bdaddc4201f9840000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c599000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    },
    {
      to: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
      data: '0xd06ca61f0000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000030000000000000000000000001f9840a85d5af5bf1d1762f925bdaddc4201f984000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec7000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    },
  ]);
});

test('uniswap v3', async () => {
  geth.batchEthCall.mockResolvedValue([
    undefined, // maybe network error
    '0x0000000000000000000000000000000000000000000000000005faa479939293',
    '0x000000000000000000000000000000000000000000000000001482f14b4989c8',
  ]);

  await expect(uniswapV3.pricing([uniToken])).resolves.toStrictEqual([
    {
      coin: 'eth_uni',
      unit: 'eth',
      value: new BigNumber('0.005773472396052936'),
    },
  ]);
  expect(providerController.getClient).toHaveBeenCalledWith(
    'eth',
    expect.any(Function),
  );
  expect(geth.batchEthCall).toHaveBeenCalledWith([
    {
      to: '0xb27308f9f90d607463bb33ea1bebb41c27ce5ab6',
      data: '0xcdca175300000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000000000000000000000000000000000000000002b1f9840a85d5af5bf1d1762f925bdaddc4201f984000bb8c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000',
    },
    {
      to: '0xb27308f9f90d607463bb33ea1bebb41c27ce5ab6',
      data: '0xcdca175300000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000421f9840a85d5af5bf1d1762f925bdaddc4201f984000bb82260fac5e5542a773aa44fbcfedf7c193bc2c599000bb8c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000000000000000000000',
    },
    {
      to: '0xb27308f9f90d607463bb33ea1bebb41c27ce5ab6',
      data: '0xcdca175300000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000000000000000000000de0b6b3a764000000000000000000000000000000000000000000000000000000000000000000421f9840a85d5af5bf1d1762f925bdaddc4201f984000bb8dac17f958d2ee523a2206206994597c13d831ec7000bb8c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000000000000000000000000000000000000000',
    },
  ]);
});
