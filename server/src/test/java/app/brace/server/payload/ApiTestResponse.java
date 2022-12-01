package app.brace.server.payload;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

// 只是为了处理 JAVA 残废的参数多态...
public class ApiTestResponse extends ApiResponse<Map<String, ?>> {
    protected ApiTestResponse(final Map<String, ?> data, final String message) {
        super(data, message);
    }

    public <T> T get(final String key, final Class<T> type) {
        assertThat(this.getData()).containsKey(key);
        final Object value = this.getData().get(key);
        assertThat(value).isInstanceOf(type);
        return type.cast(value);
    }
}
