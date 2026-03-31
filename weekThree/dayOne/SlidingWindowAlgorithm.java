package weekThree.dayOne;

import java.util.Arrays;

public class SlidingWindowAlgorithm {
    public int[] findMaxSumSubArray(int[] array, int k) {
        if (array == null || array.length < k || k <= 0) {
            return new int[0];
        }

        int subArraySum = 0;
        for (int i = 0; i < k; i++) {
            subArraySum += array[i];
        }

        int maxSum = subArraySum;
        int maxStartIndex = 0;

        for (int i = k; i < array.length; i++) {
            subArraySum += array[i] - array[i - k];
            if (subArraySum > maxSum) {
                maxSum = subArraySum;
                maxStartIndex = i - k + 1;
            }
        }

        return Arrays.copyOfRange(array, maxStartIndex, maxStartIndex + k);
    }
}
