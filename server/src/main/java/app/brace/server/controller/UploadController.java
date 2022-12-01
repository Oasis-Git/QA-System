package app.brace.server.controller;

import app.brace.server.exception.HandleableException;
import app.brace.server.payload.ApiResponse;
import lombok.Cleanup;
import lombok.extern.slf4j.Slf4j;
import one.util.streamex.EntryStream;
import org.jetbrains.annotations.NotNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.security.PermitAll;
import java.io.FileOutputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RestController
@PermitAll
@RequestMapping("/api/upload")
public class UploadController {

    @Value("${upload.static-dir}")
    private String STATIC_DIR;

    @Value("${upload.static-base-url}")
    private String STATIC_BASE_URL;

    @PermitAll
    @PostMapping
    public ResponseEntity<ApiResponse<?>>
    postFile(final @NotNull List<MultipartFile> files)
    {
        final List<String> paths = files.stream()
                                        .map(file -> UUID.randomUUID().toString())
                                        .collect(Collectors.toList());
        final List<Map.Entry<String, MultipartFile>> entries =
                EntryStream.zip(paths, files)
                           .collect(Collectors.toList());
        final List<Map<String, String>> response = new ArrayList<>();
        for (final var entry : entries) {
            final String filename;
            try {
                filename = Objects.requireNonNull(entry.getValue().getOriginalFilename());
            } catch (final NullPointerException exception) {
                throw new HandleableException("上传文件名为空。", exception, UploadController.class)
                        .handle(HttpStatus.BAD_REQUEST, UploadController.class);
            }
            try {
                final Path path = Paths.get(this.STATIC_DIR, entry.getKey(), filename);
                if (path.getParent().toFile().mkdirs()) {
                    UploadController.log.info("Made directory: {}", entry.getKey());
                }
                if (path.toFile().createNewFile()) {
                    UploadController.log.info("Created file: {}",
                                              entry.getValue().getOriginalFilename());
                }
                @Cleanup
                final var stream = new FileOutputStream(path.toFile());
                stream.write(entry.getValue().getBytes());
                response.add(Map.of("filename", filename,
                                    "url", this.STATIC_BASE_URL
                                           + '/' + entry.getKey()
                                           + '/' + filename));
            } catch (final Exception exception) {
                UploadController.log.warn("Caught exception: " + exception.getMessage());
                response.add(Map.of("filename", filename));
            }
        }
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
