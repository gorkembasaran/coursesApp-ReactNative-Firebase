import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useLayoutEffect, useState } from 'react';
import { EvilIcons } from '@expo/vector-icons';
import { useContext } from 'react';
import { CoursesContext } from '../store/coursesContext';
import CourseForm from '../components/CourseForm';
import { storeCourse, updateCourse, deleteCourseHttp } from '../helper/http';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorText from '../components/ErrorText';

export default function ManageCourse({ route, navigation }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState()
  const coursesContext = useContext(CoursesContext);
  const courseId = route.params?.courseId;
  let isEditing = false;

  const selectedCourse = coursesContext.courses.find((course)=>course.id === courseId)

  if (courseId) {
    isEditing = true;
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Kursu Güncelle' : 'Kurs Ekle',
    });
  }, [navigation, isEditing]);

  async function deleteCourse() {
    setIsSubmitting(true)
    setError(null)
    try{
      coursesContext.deleteCourse(courseId);
      await deleteCourseHttp(courseId)
    }catch(error){
      setError('Kursu silemedik')
      setIsSubmitting(false)
    }
    navigation.goBack();
  }

  function cancelHandler() {
    navigation.goBack();
  }

  if(error && !isSubmitting){
    return <ErrorText message={error} />
  }

  if(isSubmitting){
    return <LoadingSpinner />
  }

  async function addOrUpdateHandler(courseData){
    setIsSubmitting(true)
    setError(null)
    try {
      if(isEditing){
        coursesContext.updateCourse(courseId,courseData)
        await updateCourse(courseId, courseData);
      }else{
        const id = await storeCourse(courseData);
        coursesContext.addCourse({...courseData, id: id})
      }
      navigation.goBack()
    }catch(error){
      setError('Kurs eklemede ya da güncellemede problem var!')
      setIsSubmitting(false)
    }
  }

  return (
    <View style={styles.container}>
      <CourseForm cancelHandler={cancelHandler}
        onSubmit={addOrUpdateHandler}
        isEditing={isEditing}
        defaultValues={selectedCourse}
      />

      

      {isEditing && (
        <View style={styles.deleteContainer}>
          <EvilIcons
            name="trash"
            size={36}
            color="black"
            onPress={deleteCourse}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
  },
  deleteContainer: {
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: 'blue',
    paddingTop: 10,
    marginTop: 16,
  },
});
