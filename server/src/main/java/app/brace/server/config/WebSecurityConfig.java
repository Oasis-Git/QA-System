package app.brace.server.config;

import app.brace.server.security.AuthPrincipalService;
import app.brace.server.security.JwtAuthenticationFilter;
import app.brace.server.security.PasswordEncoder;
import lombok.AllArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.BeanIds;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@AllArgsConstructor
@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {
    private final AuthPrincipalService authPrincipalService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final PasswordEncoder passwordEncoder;

    @Override
    protected void configure(final @NotNull AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(this.authPrincipalService)
            .passwordEncoder(this.passwordEncoder);
    }

    @Override
    @Bean(BeanIds.AUTHENTICATION_MANAGER)
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected void configure(final @NotNull HttpSecurity http) throws Exception {
        http.cors().and()
            .csrf().disable()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
            .authorizeRequests(configure -> configure
                    .antMatchers("/api/**/signup").permitAll()
                    .antMatchers("/api/**/login").permitAll()
                    .antMatchers("/api/qa/respondents").permitAll()
                    .antMatchers("/api/qa/repo").permitAll()
                    .antMatchers("/api/user/resetPassword/**").permitAll()
                    .anyRequest().authenticated()
            )
            .addFilterBefore(this.jwtAuthenticationFilter,
                             UsernamePasswordAuthenticationFilter.class);
    }
}
