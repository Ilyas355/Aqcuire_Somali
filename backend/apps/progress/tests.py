from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken

from apps.curriculum.models import Phrase, QuizQuestion, Section, Subtopic
from apps.users.models import UserProfile

from .models import QuizAttempt


def make_user(username="testuser"):
    user = User.objects.create_user(username=username, password="pass")
    UserProfile.objects.create(user=user, handle=username)
    return user


def make_question():
    section = Section.objects.create(title="S", category_tag="c", description="", xp_reward=10, order=1)
    subtopic = Subtopic.objects.create(section=section, title="Sub", description="", order=1)
    phrase = Phrase.objects.create(subtopic=subtopic, somali="Magacaygu", english="My name is", order=1)
    return QuizQuestion.objects.create(
        phrase=phrase,
        layer=QuizQuestion.Layer.RECOGNITION,
        question_text="What does Magacaygu mean?",
        correct_answer="My name is",
        distractor_1="Hello",
        distractor_2="Goodbye",
        distractor_3="Thank you",
    )


def auth_client(test_case, user):
    token = RefreshToken.for_user(user).access_token
    test_case.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")


class WasAnsweredCorrectlyTest(APITestCase):
    def setUp(self):
        self.user = make_user()
        self.question = make_question()

    def test_returns_false_with_no_attempts(self):
        self.assertFalse(QuizAttempt.was_answered_correctly(self.user, self.question))

    def test_returns_false_after_wrong_attempt(self):
        QuizAttempt.objects.create(
            user=self.user, question=self.question,
            answer_given="Hello", is_correct=False, xp_awarded=0,
        )
        self.assertFalse(QuizAttempt.was_answered_correctly(self.user, self.question))

    def test_returns_true_after_correct_attempt(self):
        QuizAttempt.objects.create(
            user=self.user, question=self.question,
            answer_given="My name is", is_correct=True, xp_awarded=5,
        )
        self.assertTrue(QuizAttempt.was_answered_correctly(self.user, self.question))

    def test_isolated_per_user(self):
        other = make_user("other")
        QuizAttempt.objects.create(
            user=other, question=self.question,
            answer_given="My name is", is_correct=True, xp_awarded=5,
        )
        self.assertFalse(QuizAttempt.was_answered_correctly(self.user, self.question))


class QuizSubmitXpIdempotencyTest(APITestCase):
    def setUp(self):
        self.user = make_user()
        self.question = make_question()
        auth_client(self, self.user)
        self.url = reverse("progress-quiz-submit")

    def _submit(self, answer):
        return self.client.post(self.url, {"question_id": self.question.id, "answer_given": answer})

    def test_first_correct_awards_xp(self):
        res = self._submit("My name is")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data["is_correct"])
        self.assertEqual(res.data["xp_awarded"], 5)  # RECOGNITION = 5 XP

    def test_second_correct_awards_zero_xp(self):
        self._submit("My name is")
        res = self._submit("My name is")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data["is_correct"])
        self.assertEqual(res.data["xp_awarded"], 0)

    def test_wrong_answer_always_zero_xp(self):
        res = self._submit("Hello")
        self.assertFalse(res.data["is_correct"])
        self.assertEqual(res.data["xp_awarded"], 0)

    def test_wrong_then_correct_awards_xp(self):
        self._submit("Hello")
        res = self._submit("My name is")
        self.assertTrue(res.data["is_correct"])
        self.assertEqual(res.data["xp_awarded"], 5)

    def test_correct_then_wrong_then_correct_no_xp(self):
        self._submit("My name is")
        self._submit("Hello")
        res = self._submit("My name is")
        self.assertTrue(res.data["is_correct"])
        self.assertEqual(res.data["xp_awarded"], 0)

    def test_all_attempts_recorded_regardless_of_xp(self):
        self._submit("My name is")
        self._submit("My name is")
        self._submit("Hello")
        self.assertEqual(QuizAttempt.objects.filter(user=self.user, question=self.question).count(), 3)
