# WalletPage Component

## Code Review

### Computational inefficiencies / bug

1. useMemo() has the un-necessary dependency in array array - **prices**

1. **getPriority** is pure js function. So, can move it outside of component. It avoids the recreation on every render

1. **usdValue** is calculated on every render for every row. They should be memoized

1. The filter logic is inverted. It excludes amounts > 0 in **balances**

1. Wrong variable: **lhsPriority** should be **balancePriority** in **sortedBalances**

1. **sort** in **sortedBalances** doesn't return a value when priorities are equal

1. **formattedBalances** should be used to render rows instead of **sortedBalances**

1. **WalletBalance** is missing **blockchain** prop

1. **classes** is undefined

1. Double-check **toFixed()** with no argument. It rounds to 0 decimal places


### Anti-Patterns

1. Using array **index** as key of React component. The list is re-sorted / changed items (add or remove). So, should use unique identifier

1. Avoid using **any** in parameter of **getPriority**. Should use string, enum or union type instead of

1. **children** prop never used. So, should remove it

1. Have magic number in logic (like **-99**). It should put in a named constant

1. Avoid spreading **...rest** in component props. It helps to make the component cleaner, easier to maintain and prevent invalid HTML attributes from leaking into the DOM

1. Props extends **BoxProps** with an empty body. If no extend any new props, use **type** instead of

1. Inconsistent formatting (tabs and spaces, missing semicolons,...). Should make sure ESlint/prettier is setup and turn on




## Refactor Version

```typescript

type Blockchain = "Osmosis" | "Ethereum" | "Arbitrum" | "Zilliqa" | "Neo";

interface WalletBalance {
  id: string;
  currency: string;
  amount: number;
  blockchain: Blockchain;
}
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  usdValue: number;
  row: string;
}

interface Props extends BoxProps {
  className: string;
  testId?: string;
}

const getPriority = (blockchain: Blockchain): number => {
  switch (blockchain) {
    case "Osmosis":
      return 100;
    case "Ethereum":
      return 50;
    case "Arbitrum":
      return 30;
    case "Zilliqa":
      return 20;
    case "Neo":
      return 20;
    default:
      return -99;
  }
};

const WalletPage: React.FC<Props> = (props: Props) => {
  const { className, testId } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const rows = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        return leftPriority - rightPriority;
      })
      .map((balance: WalletBalance) => {
        return {
          ...balance,
          formatted: balance.amount.toFixed(2),
          usdValue: prices[balance.currency] * balance.amount,
          row: `row-${balance.id}`,
        } as FormattedWalletBalance;
      });
  }, [balances, prices]);

  return (
    <div className={className} data-testid={testId}>
      {rows.map((balance: FormattedWalletBalance) => (
        <WalletRow
          className={balance.row}
          key={balance.id}
          amount={balance.amount}
          usdValue={balance.usdValue}
          formattedAmount={balance.formatted}
        />
      ))}
    </div>
  );
};

```
