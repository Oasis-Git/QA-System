package com.example.brace_mobile.ui.respondents;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

public class RespondentsViewModel extends ViewModel {

    private MutableLiveData<String> mText;

    public RespondentsViewModel() {
        mText = new MutableLiveData<>();
        mText.setValue("This is respondents fragment");
    }

    public LiveData<String> getText() {
        return mText;
    }
}