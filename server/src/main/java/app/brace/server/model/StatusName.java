package app.brace.server.model;

import org.jetbrains.annotations.Contract;
import org.jetbrains.annotations.NotNull;
import org.web3j.tuples.generated.Tuple2;

public enum StatusName {
    CENSORING, // 待审核
    EDITING, // 编辑中
    ACCEPTING, // 待接单
    ANSWERING, // 回答中
    ANSWERED, //被第一次回答
    CHATTING, // 聊天中
    FAILED, // 订单失败
    FINISHED; // 订单完成

    public boolean hasNextStatus() {
        switch (this) {
            case FAILED, FINISHED -> {
                return false;
            }
            default -> {
                return true;
            }
        }
    }

    @Contract("_ -> new")
    public @NotNull Tuple2<StatusName, String> getNextStatus(boolean success) {
        if (success) {
            switch (this) {
                case CENSORING -> {
                    return new Tuple2<>(ACCEPTING, "审核成功");
                }
                case EDITING -> {
                    return new Tuple2<>(CENSORING, "修改成功");
                }
                case ACCEPTING -> {
                    return new Tuple2<>(ANSWERING, "接单成功");
                }
                case ANSWERING -> {
                    return new Tuple2<>(CHATTING, "回答完成");
                }
                case CHATTING -> {
                    return new Tuple2<>(FINISHED, "订单完成");
                }
            }
        } else {
            switch (this) {
                case CENSORING -> {
                    return new Tuple2<>(EDITING, "审核失败，请重新编辑");
                }
                case EDITING -> {
                    return new Tuple2<>(FAILED, "您主动取消了订单");
                }
                case ACCEPTING -> {
                    return new Tuple2<>(FAILED, "回答者拒绝接受订单");
                }
                case ANSWERING -> {
                    return new Tuple2<>(FAILED, "回答超时");
                }
                case CHATTING -> {
                    return new Tuple2<>(FINISHED, "聊天时间结束");
                }
            }
        }
        throw new IllegalArgumentException("`%s` 没有后继状态。".formatted(this.name()));
    }
}
